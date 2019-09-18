# Loan Application
This is a full stack app which aims to digitalise the loan giving service used by numerous jewellers and bankers.
It contains the data of all customers, and maintains a passbook for every collateral in the shop.
It calculates the interest payable by the customer automatically based on the number of days elapsed and the rate of interest applicable.
This also maintains various stats for the benefit of the Proprietor. 

!["Main_page_ss](views/ss/ss_1.png)

!["Information_ss](views/ss/ss_2.png)

## Installation

1.Clone/download this repository.

2.You need to have Node.js and npm installed, hence to do so, run the following command:

```sudo apt-get install nodejs```

this shall install both Nodejs and npm.

3.The application uses Mongodb for database management, hence install it using the following command:

```sudo apt-get install mongodb```

4. Go to the clone's folder and run command `npm install` to install all node-modules(dependencies) mentioned in the JSON file.

## Using the Application

1.Mongodb needs mongod service running, hence in a terminal, run the following command:

``` sudo mongod ```

2.Goto the clone's folder and run the application using the following command:

``` node app.js ```

3.The local server will start at port 3000, hence open your browser and goto the folowing URL:

>http://localhost:3000/


