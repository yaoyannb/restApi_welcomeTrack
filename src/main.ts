import express from "express";
const port = 3012;
const app = express();

app.get("/", (req, res) => {
	res.send("Hello, Universe");
})


app.get("/:index_name", (req, res) => {
	let index = req.params.index_name;
	res.send(` GET /${index} `);
})

app.delete("/:index_name", (req, res) => {
        let index = req.params.index_name;
        res.send(` DELETE /${index} `);
})

app.get("/:index_name/:doc_type", (req, res) => {
        let index = req.params.index_name;
	let doc_type = req.params.doc_type
        res.send(` GET /${index}/${doc_type} `);
})


app.get("/:index_name/:doc_type/:doc_id", (req, res) => {
        let index = req.params.index_name;
        let doc_type = req.params.doc_type
	let doc_id = req.params.doc_id
        res.send(` GET /${index}/${doc_type}/${doc_id} `);
})


.listen(port, () => {console.log("the server has started")});
