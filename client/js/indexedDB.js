/*
if (!('indexedDB' in window)) {
  console.log('This browser doesn\'t support IndexedDB');
  return;
}*/
/*
const dbPromise = idb.open('test-db', 1, upgradeDB => {
  const keyValStore = upgradeDB.createObjectStore('keyval')
  keyValStore.put('world', 'hello')
});*/


const dbPromise = idb.open('test-db', 3, upgradeDB => {
  switch (upgradeDB.oldVersion) {
  case 0:
    const keyValStore = upgradeDB.createObjectStore('keyval')
    keyValStore.put('world', 'hello')

  case 1:
    console.log('Creating the products object store');
    upgradeDB.createObjectStore('people', {keyPath: 'name'})

  case 2:
    var peopleStore = upgradeDB.transaction.objectStore('people')
    peopleStore.createIndex('animal', 'favoriteAnimal')
  case 3:
    var peopleStore = upgradeDB.transaction.objectStore('people')
    peopleStore.createIndex('age', 'age')

}

});
dbPromise.then(function(db) {
  var tx = db.transaction('keyval');
  var keyValStore = tx.objectStore('keyval');
  return keyValStore.get('hello')
}).then(function(val) {
  console.log('All items added successfully!', val);
});
dbPromise.then(function(db) {
  var tx = db.transaction('keyval', 'readwrite');
  var keyValStore = tx.objectStore('keyval');
  keyValStore.put('bar', 'foo')
  return tx.complete;
}).then(function() {
  console.log('Added foo:bar');
});

dbPromise.then(function(db) {
  var tx = db.transaction('people', 'readwrite');
  var peopleStore = tx.objectStore('people');
  var item = {
    name: 'David Gonzalez',
    age: 25,
    favoriteAnimal: 'dog'
  }
/*  var item = {
    name: 'Laura Gonzalez',
    age: 29,
    favoriteAnimal: 'cat'
  }*/
  peopleStore.put(item)
  return tx.complete
}).then(function() {
    console.log('People added successfully!');
});

dbPromise.then(function(db) {
  var tx = db.transaction('people');
  var peopleStore = tx.objectStore('people');
  var animalIndex = peopleStore.index('animal');

  return animalIndex.getAll()
}).then(function(val) {
  console.log('People: ', val);
});
