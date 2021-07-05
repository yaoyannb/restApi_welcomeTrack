
1- follow instructions in this file first
	* https://github.com/yaoyannb/kafkaConsumer_welcomeTrack/blob/v1.0/README.md

2- start the project 
	* npm start

3- these are the commands available in this rest API
	* GET informations about the index 
		- method : GET
		- url : localhost:3012/deliverydetails

	* LIST all documents available in the index
		- method: GET
		- url : localhost:3012/deliverydetails/_doc

		- this request will get results 100 by 100 
		- to restart search from th efirst result, execute 
			-method : GET
			-url : localhost:3012/deliverydetails/_doc?refresh

	* GET document by id
		- method: GET 
		- url : localhost:3012/deliverydetails/_doc/<document id> (example :localhost:3012/deliverydetails/_doc/212867664)

	* DELETE index
		- method: DELETE
		- url : localhost:3012/deliverydetails
