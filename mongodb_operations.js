const { MongoClient, ObjectId } = require('mongodb');

// Connection URL
const url = 'mongodb://localhost:27017';
const client = new MongoClient(url);

// Database Name
const dbName = 'contact';

async function main() {
    try {
        // Connect to MongoDB
        await client.connect();
        console.log('Connected successfully to MongoDB');

        const db = client.db(dbName);
        const contactList = db.collection('contactlist');

        // Clear existing documents (optional)
        await contactList.deleteMany({});

        // Insert documents
        const documents = [
            { Last_name: "Ben", First_name: "Moris", Email: "ben@gmail.com", age: 26 },
            { Last_name: "Kefi", First_name: "Seif", Email: "kefi@gmail.com", age: 15 },
            { Last_name: "Emilie", First_name: "brouge", Email: "emilie.b@gmail.com", age: 40 },
            { Last_name: "Alex", First_name: "brown", age: 4 },
            { Last_name: "Denzel", First_name: "Washington", age: 3 }
        ];

        const result = await contactList.insertMany(documents);
        console.log('\n1. Documents inserted successfully!');

        // Display all contacts
        console.log('\n2. Displaying all contacts:');
        const allContacts = await contactList.find({}).toArray();
        console.log(JSON.stringify(allContacts, null, 2));

        // Display one person by ID
        console.log('\n3. Displaying one contact by ID:');
        const oneContact = await contactList.findOne({ _id: result.insertedIds[0] });
        console.log(JSON.stringify(oneContact, null, 2));

        // Display contacts with age > 18
        console.log('\n4. Displaying contacts with age > 18:');
        const adultContacts = await contactList.find({ age: { $gt: 18 } }).toArray();
        console.log(JSON.stringify(adultContacts, null, 2));

        // Display contacts with age > 18 and name containing "ah"
        console.log('\n5. Displaying contacts with age > 18 and name containing "ah":');
        const filteredContacts = await contactList.find({
            age: { $gt: 18 },
            $or: [
                { First_name: { $regex: 'ah', $options: 'i' } },
                { Last_name: { $regex: 'ah', $options: 'i' } }
            ]
        }).toArray();
        console.log(JSON.stringify(filteredContacts, null, 2));

        // Update Kefi Seif to Kefi Anis
        console.log('\n6. Updating Kefi Seif to Kefi Anis:');
        const updateResult = await contactList.updateOne(
            { Last_name: "Kefi", First_name: "Seif" },
            { $set: { First_name: "Anis" } }
        );
        console.log(`Modified ${updateResult.modifiedCount} document`);

        // Delete contacts with age < 5
        console.log('\n7. Deleting contacts with age < 5:');
        const deleteResult = await contactList.deleteMany({ age: { $lt: 5 } });
        console.log(`Deleted ${deleteResult.deletedCount} documents`);

        // Display final contact list
        console.log('\n8. Final contact list:');
        const finalContacts = await contactList.find({}).toArray();
        console.log(JSON.stringify(finalContacts, null, 2));

    } catch (err) {
        console.error('An error occurred:', err);
    } finally {
        await client.close();
        console.log('\nDisconnected from MongoDB');
    }
}

main().catch(console.error);
