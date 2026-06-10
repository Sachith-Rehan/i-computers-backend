import Student from "../models/student.js";

export function getAllStudents(req, res){
    Student.find().then(
        (result)=> {
            res.json(result);
        }
    ).catch(
        ()=> {
            res.json({
                "message" : "error retrieving students"
            })
        }
    )
}

export function createStudent(req, res){

    if(req.user == null){
        res.status(401).jason({message : "unauthorized"});
        return;
    }

    if(req.user.isAdmin == false){
        res.status(403).json({message : "only admin can create student"});
        return;
    }

    const newStudent = Student(req.body);
        newStudent.save().then(
        ()=>{
            res.json({
                "message" : "student saved successfully"
            })
        }).catch(
            ()=>{  
                res.json({
                    "message" : "error saving student"
                })
            }
        )    
}
