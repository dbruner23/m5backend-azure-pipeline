const axios = require('axios')

const getRego = async function (req, res) {
    const { rego } = req.params;

    try {
        const response = await axios.get(`http://api.carsxe.com/platedecoder?key=${process.env.CARS_API_KEY}&plate=${rego}&state=NZ&format=json`)
        res.status(200).send(response.data);
    } catch (error) {
        res.status(404).json("Sorry you've got an error." + error)
    }
}

module.exports = {
    getRego
};