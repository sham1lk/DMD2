let Sequelize = require('sequelize');
let Postgres = require('./schema/postgres.js');
let mongoose = require('mongoose');

let Store = require('./schema/store.js');
let Staff = require('./schema/staff.js');
let Category = require('./schema/category.js');
let Country = require('./schema/country.js');
let City = require('./schema/city.js');
let Address = require('./schema/address.js');
let Customer = require('./schema/customer.js');
let Actor = require('./schema/actor.js');
let Language = require('./schema/language.js');
let Film = require('./schema/film.js');
let Inventory = require('./schema/inventory.js');
let Rental = require('./schema/rental.js');
let Payment = require('./schema/payment.js');


mongoose.connect('mongodb://localhost:27017/dvdrental', {
            useNewUrlParser: true,
            useUnifiedTopology: true,
            bufferCommands: false});

mongoose.Promise = global.Promise;
let db = mongoose.connection;
db.on('error', console.error.bind(console, 'MongoDB connection error:'));

let postgres = new Postgres();

postgres.genSchema();


async function category() {
    await postgres.Category.findAll().map(el => {
        let c = el.get();
        let category = Category(c);
        category.save();
    });
}



async function country() {
    await postgres.Country.findAll().map(el => {
        let c = el.get();
        let country = Country(c);
        country.save();
    });
}


async function city() {
    await postgres.City.findAll().map(async function(el) {
        let c = el.get();

        let country = await Country.
            where({country_id: c.country_id}).
            findOne();

        let city = Object.assign(c, {
            country: country
        });

        City(city).save();
    });
}


async function address() {
    await postgres.Address.findAll().map(async function(el) {
        let a = el.get();

        let city = await City.
            where({city_id: a.city_id}).
            findOne();


        let address = Object.assign(a, {
            city: city
        });

        Address(address).save();
    });
}

async function store() {
    await postgres.Store.findAll().map(async function(el) {
    let s = el.get();
    let address = await Address.
                where({address_id: s.address_id}).
                findOne();

    let store = Object.assign(s, {
            address: address._id
            });
    let m_store = await Store(store).save();

    });
}

async function staff() {
    await postgres.Staff.findAll().map(async function(el) {
        let s = el.get();

        let store = await Store.
            where({store_id: s.store_id}).
            findOne();
        let address = await Address.
                where({address_id: s.address_id}).
                findOne();

        let staff = await Object.assign(s, {
            address: address._id
            });

        staff = await Object.assign(s, {store: store});

        let m_staff = await Staff(staff).save();
        store.manager_staff = m_staff._id;
        await store.save();
    });
}



async function customer() {
    await postgres.Customer.findAll().map(async function(el) {
        let c = el.get();

        let store = await Store.
            where({store_id: c.store_id}).
            findOne();

        let address = await Address.
            where({address_id: c.address_id}).
            findOne();

        let customer = Object.assign(c, {
            store: store,
            address: address
        });

        Customer(customer).save();
    });
}


async function actor() {
        await postgres.Actor.findAll().map(el => {
        let a = el.get();
        let actor = Actor(a);
        actor.save();
    });
}



async function language() {
        await postgres.Language.findAll().map(el => {
        let l = el.get();
        let language = Language(l);
        language.save();
    });
}



async function film() {
    await postgres.Film.findAll().map(async function(el) {
        let f = el.get();

        let film_actors = await postgres.Film_actor.findAll({where: {
            film_id: f.film_id
        }, raw: true});

        let actors = [];
        for (let fa of film_actors){
            let actor = await Actor.
                where({actor_id: fa.actor_id}).
                findOne();

            actors.push({
                _id: actor._id,
                last_update: fa.last_update
            });
        }

        let film_category = await postgres.Film_category.findOne({where: {
            film_id: f.film_id
        }, raw: true});

        let category = await Category.
            where({category_id: film_category.category_id}).
            findOne();

        let language = await Language.
            where({language_id: f.language_id}).
            findOne();


        let film = Object.assign(f, {
            language: language,
            actors: actors,
            category: category
        });


        Film(film).save();

    });
}



async function inventory() {
    await postgres.Inventory.findAll().map(async function(el) {
        let i = el.get();

        let film = await Film.
            where({film_id: i.film_id}).
            findOne();

        let store = await Store.
            where({store_id: i.store_id}).
            findOne();

        let inventory = Object.assign(i, {
            film: film,
            store: store
        });

        Inventory(inventory).save();
    });
}


async function rental() {
    await postgres.Rental.findAll().map(async function(el) {
        let r = el.get();

        let inventory = await Inventory.
            where({inventory_id: r.inventory_id}).
            findOne();

        let customer = await Customer.
            where({customer_id: r.customer_id}).
            findOne();

        let staff = await Staff.
            where({staff_id: r.staff_id}).
            findOne();

        let rental = Object.assign(r, {
            inventory: inventory,
            customer: customer,
            staff: staff
        });

        Rental(rental).save();
    });
}
   

async function payment() {
    await postgres.Payment.findAll().map(async function(el) {
        let p = el.get();

        let customer = await Customer.
            where({customer_id: p.customer_id}).
            findOne();

        let staff = await Staff.
            where({staff_id: p.staff_id}).
            findOne();

        let rental = await Rental.
            where({rental_id: p.rental_id}).
            findOne();

        let payment = Object.assign(p, {
            customer: customer,
            staff: staff,
            rental: rental
        });
        Payment(payment).save();
    });
}

async function transfer(){



await category();   
await console.log("1 from 13");
await country();
await console.log("2 from 13");
await city();
await console.log("3 from 13");
await address();
await console.log("4 from 13");
await store();
await console.log("5 from 13");

await customer();
await console.log("6 from 13");
await staff();
await console.log("7 from 13");
await actor();
await console.log("8 from 13");
await language();
await console.log("9 from 13");
await film();
await console.log("10 from 13");
await inventory();
await console.log("11 from 13");
await rental();
await console.log("12 from 13");
await payment();
await console.log("done");
await process.exit(1);

}

transfer();