class Schema {
    constructor(){
        this.Sequelize = require('sequelize');
        this.sequelize = new this.Sequelize('dvdrental', 'postgres', 'postgres', {
            host: 'localhost',
            dialect: 'postgres',

            pool: {
                max: 5,
                min: 0,
                idle: 10000
            },
            logging: false
        });
        this.config = {
            freezeTableName: true,
            timestamps: false
        };
    }

    genSchema(){
        let s = this.sequelize;
        let S = this.Sequelize;

        let p_key = {
            type: S.INTEGER,
            primaryKey: true
        };

        this.Actor = s.define('actor', {
            actor_id: {...p_key},
            first_name: S.STRING,
            last_name: S.STRING,
            last_update: S.DATE
        }, this.config);

        this.Country = s.define('country', {
            country_id: {...p_key},
            country: S.STRING,
            last_update: S.DATE
        }, this.config);

        this.City = s.define('city', {
            city_id: {...p_key},
            city: S.STRING,
            country_id: {
                type: S.INTEGER,
                references: 'country',
                referencesKey: 'country_id'
            },
            last_update: S.DATE
        }, this.config);

        this.Address = s.define('address', {
            address_id: {...p_key},
            address: S.STRING,
            address2: S.STRING,
            district: S.STRING,
            city_id: {
                type: S.INTEGER,
                references: 'city',
                referencesKey: 'city_id'
            },
            postal_code: S.STRING,
            phone: S.STRING,
            last_update: S.DATE
        }, this.config);

        this.Category = s.define('category', {
            category_id: {...p_key},
            name: S.STRING,
            last_update: S.DATE
        }, this.config);

        this.Customer = s.define('customer', {
            customer_id: {...p_key},
            store_id: {
                type: S.INTEGER,
                references: 'store',
                referencesKey: 'store_id'
            },
            first_name: S.STRING,
            last_name: S.STRING,
            email: S.STRING,
            address_id: {
                type: S.INTEGER,
                references: 'address',
                referencesKey: 'address_id'
            },
            activebool: S.BOOLEAN,
            create_date: S.STRING,
            last_update: S.DATE,
            active: S.INTEGER
        }, this.config);

        this.Film = s.define('film', {
            film_id: {...p_key},
            title: S.STRING,
            description: S.TEXT,
            release_year: S.INTEGER,
            language_id: {
                type: S.INTEGER,
                references: 'language',
                referencesKey: 'language_id'
            },
            rental_duration: S.INTEGER,
            rental_rate: S.REAL,
            length: S.INTEGER,
            replacement_cost: S.REAL,
            rating: S.STRING,
            last_update: S.DATE,
            special_features: S.TEXT,
            fulltext: S.TEXT
        }, this.config);

        this.Film_actor = s.define('film_actor', {
            actor_id: {
                type: S.INTEGER,
                references: 'actor',
                referencesKey: 'actor_id'
            },
            film_id: {
                type: S.INTEGER,
                references: 'film',
                referencesKey: 'film_id'
            },
            last_update: S.DATE
        }, this.config);

        this.Film_category = s.define('film_category', {
            film_id: {
                type: S.INTEGER,
                references: 'film',
                referencesKey: 'film_id',
            },
            category_id: {
                type: S.INTEGER,
                references: 'category',
                referencesKey: 'category_id'
            },
            last_update: S.DATE
        }, this.config);

        this.Inventory = s.define('inventory', {
            inventory_id: {...p_key},
            film_id: {
                type: S.INTEGER,
                references: 'film',
                referencesKey: 'film_id'
            },
            store_id: {
                type: S.INTEGER,
                references: 'store',
                referencesKey: 'store_id'
            },
            last_update: S.DATE
        }, this.config);

        this.Language = s.define('language', {
            language_id: {...p_key},
            name: S.STRING,
            last_update: S.DATE
        }, this.config);

        this.Payment = s.define('payment', {
            payment_id: {...p_key},
            customer_id: {
                type: S.INTEGER,
                references: 'customer',
                referencesKey: 'customer_id'
            },
            staff_id: {
                type: S.INTEGER,
                references: 'staff',
                referencesKey: 'staff_id'
            },
            rental_id: {
                type: S.INTEGER,
                references: 'rental',
                referencesKey: 'rental_id'
            },
            amount: S.REAL,
            payment_date: S.DATE
        }, this.config);

        this.Rental = s.define('rental', {
            rental_id: {...p_key},
            rental_date: S.DATE,
            inventory_id: {
                type: S.INTEGER,
                references: 'inventory',
                referencesKey: 'inventory_id'
            },
            customer_id: {
                type: S.INTEGER,
                references: 'customer',
                referencesKey: 'customer_id'
            },
            return_date: S.DATE,
            staff_id: {
                type: S.INTEGER,
                references: 'staff',
                referencesKey: 'staff_id'
            },
            last_update: S.DATE
        }, this.config);

        this.Staff = s.define('staff', {
            staff_id: {...p_key},
            first_name: S.STRING,
            last_name: S.STRING,
            address_id: {
                type: S.INTEGER,
                references: 'address',
                referencesKey: 'address_id'
            },
            email: S.STRING,
            store_id: {
                type: S.INTEGER,
                references: 'store',
                referencesKey: 'store_id'
            },
            active: S.BOOLEAN,
            username: S.STRING,
            password: S.STRING,
            last_update: S.DATE,
            picture: S.BLOB
        }, this.config);

        this.Store = s.define('store', {
            store_id: {...p_key},
            manager_staff_id: {
                type: S.INTEGER,
                references: 'staff',
                referencesKey: 'staff_id'
            },
            address_id: {
                type: S.INTEGER,
                references: 'address',
                referencesKey: 'address_id'
            },
            last_update: S.DATE
        }, this.config);

        // Relations

        this.Film.belongsToMany(this.Category, {
            through: this.Film_category,
            foreignKey: 'category_id'
        });
        this.Category.belongsToMany(this.Film, {
            through: this.Film_category,
            foreignKey: 'film_id'
        });
    
        this.Film.belongsToMany(this.Actor, {
            through: this.Film_actor,
            foreignKey: 'actor_id'
        });
        this.Actor.belongsToMany(this.Film, {
            through: this.Film_actor,
            foreignKey: 'film_id'
        });
    }

    closeConnection(){
        this.sequelize.close();
    }
}

module.exports = Schema;
