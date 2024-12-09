import express from "express";
import bodyParser from "body-parser";
import pg from "pg"

const db = new pg.Client({
  user: "postgres",
  host: "localhost",
  database: "world",
  password: "1212",
  port: 5432,
});

db.connect();


const app = express();
const port = 3000;

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));


async function checkVisisted() {
  const result = await db.query("SELECT country_code FROM visted_countries");
  let countries = [];
  result.rows.forEach((code) => {
    countries.push(code.country_code);
    
  });
 
  
  return countries;
}



app.get("/", async (req, res) => {
  const countries = await checkVisisted();
  res.render("index.ejs", {countries: countries, total: countries.length})
});





app.post("/add", async (req, res) => {
  let input;
  try {
    input = req.body.country;
   
const result = await db.query("SELECT country_code FROM countries WHERE country_name = $1", [input.charAt(0).toUpperCase() + input.slice(1).toLowerCase()])


if (result.rows.length !== 0){
  const data = result.rows[0]
  const countrycode = data.country_code;
  console.log(countrycode);
  await db.query("INSERT INTO visted_countries (country_code) VALUES ($1)", [countrycode])
  }
  res.redirect("/");
  } catch (error) {
    console.error(error)
    const countries = await checkVisisted()
    res.render("index.ejs", {countries: countries, total: countries.length, error: `${input} has been already added`})

  }
   
    
  

 

})


app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});


