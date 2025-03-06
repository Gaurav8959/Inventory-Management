const menuItems = {
  items: [
    {
      id: 'navigation',
      title: 'Navigation',
      type: 'group',
      icon: 'icon-navigation',
      children: [
        {
          id: 'dashboard',
          title: 'Dashboard',
          type: 'item',
          icon: 'feather icon-home',
          url: '/app/dashboard'
        }
      ]
    },
    {
      id: 'customers',
      title: 'CUSTOMERS',
      type: 'group',
      icon: 'icon-navigation',
      children: [
        {
          id: 'customers',
          title: 'Customers',
          type: 'item',
          icon: 'feather icon-user-plus',
          url: '/app/customer'
        }
      ]
    },
    {
      id: 'supplier',
      title: 'SUPPLIER',
      type: 'group',
      icon: 'icon-navigation',
      children: [
        {
          id: 'supplier',
          title: 'Supplier',
          type: 'item',
          icon: 'feather icon-user-plus',
          url: '/app/supplier'
        }
      ]
    },
    {
      id: 'cashbook',
      title: 'CASHBOOK',
      type: 'group',
      icon: 'icon-navigation',
      children: [
        {
          id: 'cashbook',
          title: 'Cashbook',
          type: 'item',
          icon: 'feather icon-credit-card',
          url: '/app/cashbook'
        }
      ]
    },
    {
      id: 'collection',
      title: 'COLLECTION',
      type: 'group',
      icon: 'icon-money',
      children: [
        {
          id: 'collection',
          title: 'Collection',
          type: 'item',
          icon: 'feather icon-trending-up',
          url: '/app/collection'
        }
      ]
    },
    {
      id: 'invoice',
      title: 'INVOICE',
      type: 'group',
      icon: 'icon-money',
      children: [
        {
          id: 'invoice',
          title: 'Invoice',
          type: 'item',
          icon: 'feather icon-trending-up',
          url: '/app/new-invoice'
        }
      ]
    },
    {
      id: 'pages',
      title: 'Pages',
      type: 'group',
      icon: 'icon-pages',
      children: [
        {
          id: 'disabled-menu',
          title: 'Disabled Menu',
          type: 'item',
          url: '#',
          classes: 'nav-item disabled',
          icon: 'feather icon-power'
        }
      ]
    }
  ]
};

export default menuItems;
