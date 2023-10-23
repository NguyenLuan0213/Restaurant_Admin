export const getOrders = () => {
  return fetch("https://localhost:7274/api/orders").then((res) => res.json());
};

export const getRevenue = () => {
  return fetch("https://dummyjson.com/carts").then((res) => res.json());
};

export const getInventory = () => {
  return fetch("https://dummyjson.com/products").then((res) => res.json());
};


export const getTables = () => {
  return fetch("https://localhost:7274/api/tables").then((res) => res.json());
}

export const getAllUser = () => {
  return fetch("https://localhost:7274/api/authentication/getallusers").then((res) => res.json());
}

export const getRestaurant = () => {
  return fetch("https://localhost:7274/api/restaurantsbr").then((res) => res.json());
}

export const getMenus = () => {
  return fetch("https://localhost:7274/api/menus").then((res) => res.json());
}

export const getRoles = () => {
  return fetch("https://localhost:7274/api/authentication/getroles").then((res) => res.json());
}

export const getMenuItem = (id) => {
  return fetch(`https://localhost:7274/api/menuitem`).then((res) => res.json());
}

export const getMean = (id) => {
  return fetch(`https://localhost:7274/api/mean`).then((res) => res.json());
}

export const getMeanItem = (id) => {
  return fetch(`https://localhost:7274/api/meanItem`).then((res) => res.json());
}

export const getBill = (id) => {
  return fetch(`https://localhost:7274/api/bill`).then((res) => res.json());
}

export const getComments = (id) => {
  return fetch(`https://localhost:7274/api/comments`).then((res) => res.json());
}

export const getPromotion = (id) => {
  return fetch(`https://localhost:7274/api/promotion`).then((res) => res.json());
}

export const getBillDb = (id) => {
  return fetch(`https://localhost:7274/api/bill/getbillbydashboard`).then((res) => res.json());
}

export const getCancelOrder = (id) => {
  return fetch(`https://localhost:7274/api/orders/cancelorders`).then((res) => res.json());
}

export const getSumUser = (id) => {
  return fetch(`https://localhost:7274/api/authentication/getsumuser`).then((res) => res.json());
}

export const getChartByAll = (id) => {
  return fetch(`https://localhost:7274/api/bill/getchartbymonthall`).then((res) => res.json());
}