// for each folder
//     for each file
//         if modified time changed from database
//             record hash and size
//     sort, record cumulative hash and size
// Store data in sqlite

const sqlite3 = require('sqlite3').verbose();
const fs = require('fs');
const os = require('os');

const metadata = {
    byHash: {},
    byPath: {}, // reference hash
};

const configFolder = os.homedir() + '/.duplicates.sqlite3';
const db = new sqlite3.Database(configFolder);

db.serialize(_ => {
    db.run(`
        create table if not exists hashes (
            modified datetime not null,
            hash text not null,
            size integer not null
        );
        create table if not exists paths (
            parent integer not null default -1,
            name text not null,
            type integer not null
            depth integer not null
        );
        create index if not exists path_parent on paths(parent);
        create index if not exists hash_hash on hashes(hash);
        create index if not exists hash_size on hashes(size);
    `);
});

db.close();

