const axios = require('axios')

const getRego = async function (req, res) {
    const { rego } = req.params;

    try {
        const response = await axios.get(`http://api.carsxe.com/platedecoder?key=mxt1nrqj6_cyicji008_s31yhcqle&plate=${rego}&state=NZ&format=json`)
        res.status(200).json(response.data);
    } catch (error) {
        res.status(404).json("Sorry you've got an error." + error)
    }
}

module.exports = {
    getRego
};