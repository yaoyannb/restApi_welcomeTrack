import express from "express";
import { Client } from "@elastic/elasticsearch"
const port = 3012;
const app = express();
const client = new Client({node: 'http://localhost:9200'});

let pitid="no";
let sortTab =["no",0];

app.get("/", (req, res) => {
	res.send("Hello, Universe");
})


app.get("/:index_name", async (req, res) => {
	let index = req.params.index_name;
	let result_infos = await client.indices.get({
		index: index
	});
	res.send(result_infos);
	//res.send(` GET /${index} `);
})

app.delete("/:index_name", async (req, res) => {
        let index = req.params.index_name;
	let result_delete = await client.indices.delete({
		index: index	
	});
	//res.send(` DELETE /${index} `);
	res.send(result_delete);
})

app.get("/:index_name/:doc_type", async (req, res) => {
        let index = req.params.index_name;
	let doc_type = req.params.doc_type;

	
	console.log(req.query);

	if(req.query.hasOwnProperty("refresh"))
	{
		let result_delete = await client.closePointInTime({
                
                        body: {id: pitid },
                });
		pitid="no";
		sortTab=["no",0];

		res.send("refresh = "+ result_delete);
                //console.log("refresh=  " + result_delete);
	}

	else if(pitid=="no")
	{
		let result_create = await client.openPointInTime({
		
			index: index,
			keep_alive: "1m"
		});

		pitid = result_create.body.id;
		console.log("new pit = " +result_create.body.id);

		try
		{
			let result_search= await  client.search(
				{
					index: ""/*index*/,
					size:100,
					type: doc_type,
					//sort: "id.keyword,:asc",
					body: { 
						query: {match_all:{}},
						pit:{id:pitid, keep_alive:"1m"},
						sort:{"id.keyword":{"order":"asc"}}
					}
				},
				{
					maxRetries: 3
				}
			);

			pitid = result_search.body.pit_id;
			sortTab = result_search.body.hits.hits[99].sort;
			res.send(result_search);
		}
		catch(e)
		{
			console.log(e);
		}
	}
	else
	{
		console.log("old pit"+ pitid);

		
		let result_search= await  client.search(
			{
				index: ""/*index*/,
				size:100,
				type: doc_type,
				body: { 
					query: {match_all:{}},
					pit:{id:pitid, keep_alive:"1m"},
					sort:{"id.keyword":{"order":"asc"}},
					search_after: sortTab,
					track_total_hits: false
				}
			},
			{
				maxRetries: 3
			}
		);

		pitid = result_search.body.pit_id;
		sortTab = result_search.body.hits.hits[99].sort;
		res.send(result_search);
	}



//        res.send(` GET /${index}/${doc_type} `);
})


app.get("/:index_name/:doc_type/:doc_id", (req, res) => {
        let index = req.params.index_name;
        let doc_type = req.params.doc_type;
	let doc_id = req.params.doc_id;

	client.search({
		index: index,
		type: doc_type,
		body: { query: {match:{ "id": doc_id }}}},

		{
			maxRetries: 3
		}, 
		(err, result) => {
			if (err) console.log(err); 
			res.send (result)
		}
	);

})


.listen(port, () => {console.log("the server has started")});
