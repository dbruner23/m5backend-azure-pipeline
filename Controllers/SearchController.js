const axios = require('axios');
const dotenv = require("dotenv");
dotenv.config();

//mock data to save moneyyyyy
const mockResponse = {
    "vin": "WBABM52010JM21918",
    "EngineSize": "2788",
    "CarModel": "728i",
    "assembly": "IMPORTED BUILT-UP",
    "RegistrationYear": "2000",
    "NumberOfSeats": "0",
    "CarMake": "BMW",
    "input": {
        "state": "NZ",
        "country": "",
        "plate": "lpn101"
    },
    "Description": "2000 BMW 728i",
    "FuelType": "Petrol",
    "success": true,
    "BodyStyle": "SEDAN",
    "imageUrl": "https://api.carsxe.com/pic?image=@Qk1XIDcyOGk="
}

const getRego = async (req, res) => {
    const { rego } = req.params;
    // res.status(200).json(mockResponse)

    try {
        const response = await axios.get(`http://api.carsxe.com/platedecoder?key=8ti0mvx6x_m2ts2jzmw_tf6gw7d3a&plate=${rego}&state=NZ&format=json`)
        res.status(200).json(response.data);
    } catch (error) {
        res.status(404).json("Sorry you've got an error." + error)
    }
}

module.exports = {
    getRego
};