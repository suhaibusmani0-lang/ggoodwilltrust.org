"""Admin submissions management - generic helpers for listing, viewing, updating
form submissions across all collections."""
from typing import Optional
from datetime import datetime, timezone
from fastapi import APIRouter, HTTPException, Query
from pydantic import BaseModel


class UpdateSubmissionPayload(BaseModel):
    read: Optional[bool] = None
    archived: Optional[bool] = None


def build_router(collections: dict, auth_dependency=None) -> APIRouter:
    """collections: {kind: motor_collection}
    auth_dependency: FastAPI dependency to require authentication (optional)."""
    from fastapi import Depends
    dependencies = [Depends(auth_dependency)] if auth_dependency else []
    router = APIRouter(prefix="/admin/submissions", tags=["admin"], dependencies=dependencies)

    def _collection(kind: str):
        coll = collections.get(kind)
        if coll is None:
            raise HTTPException(status_code=404, detail=f"Unknown submission kind: {kind}")
        return coll

    def _strip_photo_bytes(doc: dict):
        """For list views, remove base64 from photo dicts to keep response lean."""
        if not doc:
            return doc
        # trade-in has photos: {slot: {filename, contentType, size, base64}}
        if 'photos' in doc and isinstance(doc['photos'], dict):
            doc['photos'] = {
                k: {"filename": v.get("filename"), "contentType": v.get("contentType"), "size": v.get("size")}
                for k, v in doc['photos'].items() if isinstance(v, dict)
            }
        # glass-repair has damagePhoto/insuranceCard; purchase-request has dlFile
        for key in ('damagePhoto', 'insuranceCard', 'dlFile'):
            if doc.get(key) and isinstance(doc[key], dict):
                doc[key] = {"filename": doc[key].get("filename"), "contentType": doc[key].get("contentType"), "size": doc[key].get("size")}
        return doc

    @router.get("/{kind}")
    async def list_submissions(
        kind: str,
        q: Optional[str] = Query(None, description="Search name/email"),
        from_date: Optional[str] = Query(None, description="ISO date e.g. 2026-01-01"),
        to_date: Optional[str] = Query(None, description="ISO date e.g. 2026-12-31"),
        read: Optional[bool] = None,
        archived: Optional[bool] = None,
        limit: int = 200,
    ):
        coll = _collection(kind)
        query: dict = {}

        # search across common name/email fields
        if q:
            query['$or'] = [
                {"firstName": {"$regex": q, "$options": "i"}},
                {"lastName": {"$regex": q, "$options": "i"}},
                {"name": {"$regex": q, "$options": "i"}},
                {"email": {"$regex": q, "$options": "i"}},
                {"phone": {"$regex": q, "$options": "i"}},
                {"referralFirstName": {"$regex": q, "$options": "i"}},
                {"referralLastName": {"$regex": q, "$options": "i"}},
                {"yourFirstName": {"$regex": q, "$options": "i"}},
                {"yourLastName": {"$regex": q, "$options": "i"}},
                {"yourEmail": {"$regex": q, "$options": "i"}},
            ]

        # date range on createdAt
        if from_date or to_date:
            date_filter: dict = {}
            if from_date:
                try:
                    date_filter['$gte'] = datetime.fromisoformat(from_date)
                except ValueError:
                    raise HTTPException(status_code=400, detail="Invalid from_date format, use YYYY-MM-DD")
            if to_date:
                try:
                    date_filter['$lte'] = datetime.fromisoformat(to_date + 'T23:59:59')
                except ValueError:
                    raise HTTPException(status_code=400, detail="Invalid to_date format, use YYYY-MM-DD")
            query['createdAt'] = date_filter

        # read/archived flags (treat missing field as false)
        if read is True:
            query['read'] = True
        elif read is False:
            query['$and'] = query.get('$and', []) + [{"$or": [{"read": False}, {"read": {"$exists": False}}]}]

        if archived is True:
            query['archived'] = True
        elif archived is False:
            query['$and'] = query.get('$and', []) + [{"$or": [{"archived": False}, {"archived": {"$exists": False}}]}]

        docs = await coll.find(query, {"_id": 0}).sort("createdAt", -1).to_list(limit)
        return [_strip_photo_bytes(d) for d in docs]

    @router.get("/{kind}/counts")
    async def submission_counts(kind: str):
        coll = _collection(kind)
        total = await coll.count_documents({})
        unread = await coll.count_documents({"$or": [{"read": False}, {"read": {"$exists": False}}], "$and": [{"$or": [{"archived": False}, {"archived": {"$exists": False}}]}]})
        return {"kind": kind, "total": total, "unread": unread}

    @router.get("/{kind}/{item_id}")
    async def get_submission(kind: str, item_id: str):
        coll = _collection(kind)
        doc = await coll.find_one({"id": item_id}, {"_id": 0})
        if not doc:
            raise HTTPException(status_code=404, detail="Submission not found")
        return doc

    @router.patch("/{kind}/{item_id}")
    async def update_submission(kind: str, item_id: str, payload: UpdateSubmissionPayload):
        coll = _collection(kind)
        update = {k: v for k, v in payload.dict().items() if v is not None}
        if not update:
            raise HTTPException(status_code=400, detail="No fields to update")
        update['updatedAt'] = datetime.now(timezone.utc)
        result = await coll.update_one({"id": item_id}, {"$set": update})
        if result.matched_count == 0:
            raise HTTPException(status_code=404, detail="Submission not found")
        doc = await coll.find_one({"id": item_id}, {"_id": 0})
        return _strip_photo_bytes(doc)

    @router.delete("/{kind}/{item_id}")
    async def delete_submission(kind: str, item_id: str):
        coll = _collection(kind)
        result = await coll.delete_one({"id": item_id})
        if result.deleted_count == 0:
            raise HTTPException(status_code=404, detail="Submission not found")
        return {"message": "Deleted"}

    return router
