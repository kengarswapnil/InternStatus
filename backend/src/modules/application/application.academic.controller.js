import { getAcademicInternshipTrackService } from "./application.academic.service.js";

export const getAcademicInternshipTrackController = async (req,res)=>{

  try{

    const { applicationId } = req.params;

    const data = await getAcademicInternshipTrackService(applicationId);

    res.json({
      success:true,
      data
    });

  }catch(err){

    res.status(400).json({
      success:false,
      message:err.message
    });

  }

};