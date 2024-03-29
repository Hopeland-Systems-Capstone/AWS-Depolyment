const express = require("express");
const router = express.Router();
const limiter = require('./rate_limit/rate_limiting').limiter
const sensor_api = require('../api/sensor_api');
const users_api = require('../api/users_api');
const api_key_util = require('./util/api_key_util');

//GET | /sensors/:sensor_id?key=apikey | Returns all sensor data in json format
//GET | /sensors?key=apikey&longitude=0&latitude=0&distance=1000 | Returns all sensors within 1000 meters of longitude=0,latitude=0
//GET | /sensors/:sensor_id/name?key=val | Return sensor name given `sensor_id`
//GET | /sensors/:sensor_id/status?&key=val | Return sensor status given `sensor_id`
//PUT | /sensors/:sensor_id/status/:status?&key=val | Set sensor with `sensor_id` to `status`
//GET | /sensors/:sensor_id/readings?dataType=dataType&timeStart=timeStart&timeEnd=timeEnd&key=val | Return sensor readings of `dataType` from `timeStart` to `timeEnd` for `sensor_id`
//GET | /sensors/:sensor_id/lastReading?dataType=:dataType&key=val | Return last sensor reading of `dataType` for `sensor_id`
//GET | /sensors/:sensor_id/LastUpdate?key=val | Return last sensor update for `sensor_id`
//POST | /sensors?key=apikey&sensor=name&longitude=0&latitude=0 | Create a sensor with a name, longitude, and latitude
//DELETE | /sensors/:sensor_id?key=apikey | Delete a sensor with an id
//PUT | /sensors/:sensor_id?key=apikey&datatype=battery&value=100 | Add new data to a sensor

router.get("/", limiter, async (req, res, next) => {

    if (!await api_key_util.checkKey(res,req.query.key)) return;

    const longitude = parseInt(req.query.longitude);
    const latitude = parseInt(req.query.latitude);
    const distance = parseInt(req.query.distance);

    if (isNaN(longitude) || isNaN(latitude) || isNaN(distance)) {
        return res.status(400).json({ error: 'Invalid arguments.' });
    }

    const data = await sensor_api.getSensorsByGeolocation(longitude,latitude,distance);
    return res.status(200).json(data);

});

router.get("/:sensor_id", limiter, async (req, res, next) => {

    if (!await api_key_util.checkKey(res,req.query.key)) return;

    const sensor_id = parseInt(req.params.sensor_id);

    if (typeof sensor_id == 'undefined' || sensor_id == NaN) {
        return res.status(400).json({ error: 'Invalid arguments.' });
    } else {
        const data = await sensor_api.getSensorData(sensor_id);
        return res.status(200).json(data);
    }

});

router.post("/", limiter, async (req, res, next) => {

    if (!await api_key_util.checkKey(res,req.query.key)) return;

    const name = req.query.sensor;
    const longitude = parseInt(req.query.longitude);
    const latitude = parseInt(req.query.latitude);

    if (!name || isNaN(longitude) || isNaN(latitude)) {
        return res.status(400).json({ error: 'Invalid arguments.' });
    }

    try {
        if (await sensor_api.createSensor(name, longitude, latitude)) {
            return res.status(201).json({ message: 'Sensor created successfully.' });
        } else {
            return res.status(500).json({ message: 'Error creating sensor.' });
        }
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: 'Error creating sensor.' });
    }
});

router.delete("/:sensor_id", limiter, async (req, res, next) => {

    if (!await api_key_util.checkKey(res,req.query.key)) return;

    const sensor_id = parseInt(req.params.sensor_id);

    if (typeof sensor_id == 'undefined' || sensor_id == NaN) {
        return res.status(400).json({ error: 'Invalid arguments.' });
    }

    if (await sensor_api.deleteSensor(sensor_id)) {
        return res.status(200).json({ message: 'Sensor deleted successfully.' });
    } else {
        return res.status(500).json({ message: 'Error deleting sensor.' });
    }
});

router.put("/:sensor_id", limiter, async (req, res, next) => {

    if (!await api_key_util.checkKey(res,req.query.key)) return;

    const sensor_id = parseInt(req.params.sensor_id);
    const datatype = req.query.datatype;
    const value = Number(req.query.value);

    if (typeof sensor_id == 'undefined' || sensor_id === NaN || !datatype || isNaN(value)) {
        return res.status(400).json({ error: 'Invalid arguments.' });
    }

    if (await sensor_api.addSensorData(sensor_id, datatype, value)) {
        return res.status(200).json({ message: `Added ${value} to ${datatype} for sensor ${sensor_id}.` });
    } else {
        return res.status(500).json({ message: 'Error adding data to sensor.' });
    }
});

router.get('/:sensor_id/lastUpdated', async (req, res) => {

    if (!await api_key_util.checkKey(res,req.query.key)) return;

    const sensor_Id = parseInt(req.params.sensor_id);
    
    if (sensor_Id === NaN) {
        res.status(400).send('Invalid arguments');
    } else {
        try {
            const reading = await sensor_api.getLastUpdated(sensor_Id);
            if (reading) {
                return res.status(200).json(reading);
            } else {
                return res.status(500).json({message: `Error getting last update`});
            }
        } catch (error) {
            console.log(error);
            return res.status(500).json({message: `Error getting last update`});  
        }
    }
});

router.get('/:sensor_id/lastReading', async (req, res) => {

    if (!await api_key_util.checkKey(res,req.query.key)) return;

    const sensor_Id = parseInt(req.params.sensor_id);
    const dataType = String(req.query.dataType);
    
    if (sensor_Id === NaN || !dataType) {
        res.status(400).send('Invalid arguments')
    } else {
        const data = await sensor_api.getLastReading(sensor_Id, dataType);
        return res.status(200).json(data)
    }
});

router.get('/:sensor_id/readings', async (req, res) => {

    if (!await api_key_util.checkKey(res,req.query.key)) return;

    const sensor_Id = parseInt(req.params.sensor_id);
    const dataType = String(req.query.dataType);
    const timeStart = parseInt(req.query.timeStart);
    const timeEnd = parseInt(req.query.timeEnd);

    if (sensor_Id === NaN || !dataType || timeStart === NaN || timeEnd === NaN) {
        res.status(400).send('Invalid arguments')
    } else {
        const data = await sensor_api.getReadings(sensor_Id, dataType, timeStart, timeEnd)
        return res.status(200).json(data);
    }    
});


router.get('/:sensor_id/status', async (req, res) => {

    if (!await api_key_util.checkKey(res,req.query.key)) return;

    const sensorId = parseInt(req.params.sensor_id);

    const status = await sensor_api.getStatus(sensorId);

    if (!status) {
      res.status(404).send('Sensor not found');
    } else {
      res.send(status);
    }
});

router.get('/:sensor_id/name', async (req, res) => {

    if (!await api_key_util.checkKey(res,req.query.key)) return;

    const sensorId = parseInt(req.params.sensor_id);

    const name = await sensor_api.getName(sensorId);

    if (!name) {
      res.status(404).send('Sensor not found');
    } else {
      res.send(name);
    }
});

router.put('/:sensor_id/status/:status', async (req, res) => {

    if (!await api_key_util.checkKey(res,req.query.key)) return;

    const sensor_id = parseInt(req.params.sensor_id);
    const status = String(req.params.status);

    console.log(sensor_id, status);
    
    if (typeof sensor_id == 'undefined' || sensor_id == NaN || !status ) {
        return res.status(400).json({ error: 'Invalid arguments.' });
    } else {
        await sensor_api.setStatus(sensor_id, status);
        return res.status(200).json({ message: `Changed sensor ${sensor_id} to status ${status}.` });
    }
});

module.exports = router;