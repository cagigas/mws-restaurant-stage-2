registerServiceWorker = () => {
  if (!navigator.serviceWorker) return;

  navigator.serviceWorker.register('/sw.js').then(function (reg) {
    console.log('Registration Worked!');
    if (!navigator.serviceWorker.controller) {
      return;
    }

  }).catch(function () {
    console.log('Registration failed!')
  });
}

openDatabase = () => {
  return idb.open('restaurants', 1, upgradeDB => {
    switch (upgradeDB.oldVersion) {
      case 0:
        const store = upgradeDB.createObjectStore('restaurants', {keyPath: 'id'})
        store.createIndex('neighborhood', 'neighborhood')
    }
  })
}


registerServiceWorker();
const dbPromise = openDatabase()

fetch('http://localhost:1337/restaurants')
  .then(function(response) {
    console.log(response)
    return response.json();
  })
  .then(function(restaurants) {
    console.log("Restaurants: ", restaurants)
    dbPromise.then(function(db) {
      if(!db) return;
      var tx = db.transaction('restaurants', 'readwrite');
      var store = tx.objectStore('restaurants');
      restaurants.map((restaurant)=>{
        store.put(restaurant)
      })
    })
  })
  .catch((err) => {
    console.log("Error fetching data.")
  });
