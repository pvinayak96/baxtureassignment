const {v4, validate} = require('uuid');

let userDB = [];

const getAllPersons = async (req, res) =>{
    try{
        res.status(200).json(userDB)
    }
    catch(err){
        res.status(500).json({error : 'Internal Server Error'})
    }
}

const getUser = async (req, res) =>{
    try{
        const {userId} = req.params;
        
        if(!validate(userId)){
            return res.status(400).json({error : 'Invalid user ID'})
        }
        const users = userDB.find(user => {return user.id ==userId});

        if(!users){
            return res.status(404).json({error : 'User not found!!'})
        }
        res.status(200).json(users);
    }
    catch(err){
        res.status(500).json({error : 'Internal Server Error'})
    }
}

const createNewUser = async (req, res) =>{
    try{
        const {username, age, hobbies} = req.body;

        //Check if required inputs are available
        if(!username || !age || !Array.isArray(hobbies)){
            return res.status(400).json({error : 'Username, age and hobbies are required'});
        }

        //Validating hobbies to be only an array of strings or an empty array
        if(hobbies.length>0){
            const filteredHobbies = hobbies.filter(hobby => typeof hobby ==="string");
            if (filteredHobbies.length != hobbies.length){
                return res.status(400).json({error: 'Username, age and hobbies are required'})
            }
        }

        const newUser = {"id":v4(), "username":username, "age":age,"hobbies":hobbies}
        userDB.push(newUser);
        res.status(200).json(newUser);

    }
    catch(err){
        res.status(500).json({error : 'Internal Server Error'})
    }
}

const updateUser = async (req, res) =>{
    try{
        const {userId} = req.params;
        const  {username, age,hobbies} =req.body;

        if(!validate(userId)){
            return res.status(400).json({error : 'Invalid user ID'})
        }
        const userIndex = userDB.findIndex(user => {return user.id == userId});

        if(userIndex == -1){
            return res.status(404).json({error : 'User not found!!'})
        }
        userDB[userIndex] = {userId, username,age, hobbies};
        res.status(200).json(userDB[userIndex]);
    }
    catch(err){
        res.status(500).json({error : 'Internal Server Error'})
    }
}

const deleteUser = async (req, res) =>{
    try{
        const {userId} = req.params;

        if(!validate(userId)){
            return res.status(400).json({error : 'Invalid user ID'})
        }
        const userIndex = userDB.findIndex(user => {return user.id == userId});

        if(userIndex == -1){
            return res.status(404).json({error : 'User not found!!'})
        }
        userDB.splice(userIndex,1);
        res.status(204).send();
    }
    catch(err){
        res.status(500).json({error : 'Internal Server Error'})
    }

}

module.exports = {getAllPersons, getUser, createNewUser, updateUser, deleteUser}