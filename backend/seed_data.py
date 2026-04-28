import asyncio
from motor.motor_asyncio import AsyncIOMotorClient
import os
from dotenv import load_dotenv
from pathlib import Path

ROOT_DIR = Path(__file__).parent
load_dotenv(ROOT_DIR / '.env')

# MongoDB connection
mongo_url = os.environ['MONGO_URL']
client = AsyncIOMotorClient(mongo_url)
db = client[os.environ['DB_NAME']]

vehicles_data = [
    {
        "id": "1",
        "year": 2008,
        "make": "Toyota",
        "model": "Highlander",
        "trim": "Base",
        "price": 7500,
        "mileage": 150420,
        "image": "https://images.unsplash.com/photo-1565043666747-69f6646db940?w=800",
        "engine": "3.5L V6 270hp 248ft. lbs.",
        "transmission": "5-Speed Automatic",
        "drivetrain": "All Wheel Drive",
        "exteriorColor": "Classic Silver Metallic",
        "bodyType": "SUV",
        "featured": True
    },
    {
        "id": "2",
        "year": 2023,
        "make": "Jeep",
        "model": "Gladiator",
        "trim": "Freedom",
        "price": 28890,
        "mileage": 45101,
        "image": "https://images.unsplash.com/photo-1506015391300-4802dc74de2e?w=800",
        "engine": "3.6L V6 285hp 260ft. lbs.",
        "transmission": "8-Speed Shiftable Automatic",
        "drivetrain": "Four Wheel Drive",
        "exteriorColor": "Black Clear Coat",
        "bodyType": "Pickup",
        "featured": True
    },
    {
        "id": "3",
        "year": 2006,
        "make": "Toyota",
        "model": "Highlander",
        "trim": "Limited",
        "price": 8450,
        "mileage": 104568,
        "image": "https://images.pexels.com/photos/10673703/pexels-photo-10673703.jpeg?w=800",
        "engine": "3L NA V6 DOHC 24V",
        "transmission": "5-Speed Automatic",
        "drivetrain": "All Wheel Drive",
        "exteriorColor": "Millennium Silver Metallic",
        "bodyType": "SUV",
        "featured": True
    },
    {
        "id": "4",
        "year": 2005,
        "make": "Lexus",
        "model": "RX 330",
        "trim": "Base",
        "price": 6500,
        "mileage": 151548,
        "image": "https://images.unsplash.com/photo-1676288176903-a68732722cce?w=800",
        "engine": "3L NA V6 DOHC 24V",
        "transmission": "5-Speed Automatic",
        "drivetrain": "All Wheel Drive",
        "exteriorColor": "Black Onyx",
        "bodyType": "SUV",
        "featured": False
    },
    {
        "id": "5",
        "year": 2013,
        "make": "Toyota",
        "model": "RAV4",
        "trim": "XLE",
        "price": 12900,
        "mileage": 71800,
        "image": "https://images.unsplash.com/photo-1630165356623-266076eaceb6?w=800",
        "engine": "2.5L I4 176hp 172ft. lbs.",
        "transmission": "6-Speed Shiftable Automatic",
        "drivetrain": "All Wheel Drive",
        "exteriorColor": "Super White",
        "bodyType": "SUV",
        "featured": True
    },
    {
        "id": "6",
        "year": 2015,
        "make": "Toyota",
        "model": "Venza",
        "trim": "LE",
        "price": 11900,
        "mileage": 106552,
        "image": "https://images.pexels.com/photos/17357659/pexels-photo-17357659.jpeg?w=800",
        "engine": "2.7L I4 182hp 182ft. lbs.",
        "transmission": "6-Speed Shiftable Automatic",
        "drivetrain": "All Wheel Drive",
        "exteriorColor": "Celestial Silver",
        "bodyType": "Wagon",
        "featured": False
    },
    {
        "id": "7",
        "year": 2012,
        "make": "Lexus",
        "model": "ES 350",
        "trim": "Base",
        "price": 12850,
        "mileage": 71185,
        "image": "https://images.pexels.com/photos/9702321/pexels-photo-9702321.jpeg?w=800",
        "engine": "3.5L V6 268hp 248ft. lbs.",
        "transmission": "6-Speed Automatic",
        "drivetrain": "Front Wheel Drive",
        "exteriorColor": "Nebula Gray Pearl",
        "bodyType": "Sedan",
        "featured": True
    },
    {
        "id": "8",
        "year": 2014,
        "make": "Mercedes-Benz",
        "model": "E-Class",
        "trim": "E 350 Sport 4MATIC",
        "price": 9850,
        "mileage": 104186,
        "image": "https://images.unsplash.com/photo-1578991132108-16c5296b63dc?w=800",
        "engine": "3.5L V6 302hp 273ft. lbs.",
        "transmission": "7-Speed Shiftable Automatic",
        "drivetrain": "All Wheel Drive",
        "exteriorColor": "Steel Grey Metallic",
        "bodyType": "Sedan",
        "featured": False
    },
    {
        "id": "9",
        "year": 2026,
        "make": "Toyota",
        "model": "Corolla",
        "trim": "LE",
        "price": 19900,
        "mileage": 2605,
        "image": "https://images.unsplash.com/photo-1579653384681-c3ba17c4a8c9?w=800",
        "engine": "2.0L I4 169hp 151ft. lbs.",
        "transmission": "10-Speed Shiftable CVT",
        "drivetrain": "Front Wheel Drive",
        "exteriorColor": "Celestite",
        "bodyType": "Sedan",
        "featured": True
    },
    {
        "id": "10",
        "year": 2010,
        "make": "Lexus",
        "model": "RX 350",
        "trim": "Base",
        "price": 10950,
        "mileage": 133557,
        "image": "https://images.pexels.com/photos/8783587/pexels-photo-8783587.jpeg?w=800",
        "engine": "3.5L V6 275hp 257ft. lbs.",
        "transmission": "6-Speed Shiftable Automatic",
        "drivetrain": "All Wheel Drive",
        "exteriorColor": "Smoky Granite Mica",
        "bodyType": "SUV",
        "featured": False
    },
    {
        "id": "11",
        "year": 2013,
        "make": "Honda",
        "model": "Civic",
        "trim": "LX",
        "price": 10900,
        "mileage": 87879,
        "image": "https://images.unsplash.com/photo-1567789884554-0b844b597180?w=800",
        "engine": "1.8L I4 140hp 128ft. lbs.",
        "transmission": "5-Speed Automatic",
        "drivetrain": "Front Wheel Drive",
        "exteriorColor": "Alabaster Silver Metallic",
        "bodyType": "Sedan",
        "featured": False
    },
    {
        "id": "12",
        "year": 2025,
        "make": "Volkswagen",
        "model": "Atlas Cross Sport",
        "trim": "SE",
        "price": 28950,
        "mileage": 14698,
        "image": "https://images.unsplash.com/photo-1547076286-60c93f1a3652?w=800",
        "engine": "2.0L Turbo I4 269hp 273ft. lbs.",
        "transmission": "8-Speed Automatic",
        "drivetrain": "Front Wheel Drive",
        "exteriorColor": "Pure White",
        "bodyType": "SUV",
        "featured": False
    }
]

async def seed_database():
    print("Seeding database...")
    
    # Clear existing vehicles
    await db.vehicles.delete_many({})
    
    # Insert new vehicles
    await db.vehicles.insert_many(vehicles_data)
    
    print(f"Successfully seeded {len(vehicles_data)} vehicles!")
    client.close()

if __name__ == "__main__":
    asyncio.run(seed_database())
