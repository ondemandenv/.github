https://s12d.com/espresso

converted into CDK project of 3 app/services in 3 separated repos:

1) https://github.com/ondemandenv/coffee-shop--order-manager  producing dynamoDB tables and event bus
2) https://github.com/ondemandenv/coffee-shop--order-processor consuming 1)'s dynamoDB tables and event bus
3) https://github.com/ondemandenv/coffee-shop--order-manager consuming 1)'s dynamoDB tables and event bus

link to it's Viz Gui: http://vizuistack-bucket43879c71-hlpginonw2aa.s3-website-us-west-1.amazonaws.com/index.html#coffee-shop-foundation,coffeeShopOrderProcessor,coffeeShopOrderManager
