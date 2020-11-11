import { environment } from './../src/environments/environment';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class RequestService {

  private url: string = environment.apiUrl;



  constructor(public http: HttpClient) {}

  //--------------------------------Project-----------------------------------//

  createProject(data: any) {
    console.log('ProjectService -> createProject -> data', data);

    try {
      return this.http.post(this.url + '/project/createProject', data);
    } catch (error) {
      console.log(' error', error);
    }
  }

  getAllDataProject() {
    try {
      return this.http.get(this.url + '/project/getDataProject');
    } catch (error) {
      console.log(' error', error);
    }
  }

  getDataProjectByIdForUpdate(id) {
    try {
      return this.http.get(this.url + '/project/getDataProjectforupdate/' + id);
    } catch (error) {
      console.log('error',error );
    }
  }

  updateDataProject(id, data) {
    try {
      return this.http.put(this.url + '/project/updateProject/' + id, data);
    } catch (error) {
      console.log(' error', error);
    }
  }

  deleteDataProject(id) {
    try {
      return this.http.delete(this.url + '/project/deleteDataProject/' + id);
    } catch (error) {
      console.log(' error', error);
    }
  }

  searchDataProject(data) {
    try {
      return this.http.post(this.url + '/project/searchListProject', data);
    } catch (error) {
      console.log(' error', error);
    }
  }

  //-------------------------------- End Project--------------------------------------//


  //------------------------------------jobtype---------------------------------------//


  createJobType(data: any) {
    try {
      return this.http.post(this.url + '/jobType/createJobType', data);
    } catch (error) {
      console.log(' error', error);
    }
  }

  getAllDataJobType() {
    try {
      return this.http.get(this.url + '/jobType/getDataJobtype');
    } catch (error) {
      console.log(' error', error);
    }
  }


  getDataJobTypeByIdForUpdate(id) {
    try {
      return this.http.get(this.url + '/jobType/getDataJobTypeforupdate/' + id);
    } catch (error) {
      console.log('error',error );
    }
  }


  updateDataJobType(id, data) {
    try {
      return this.http.put(this.url + '/jobType/updateJobType/' + id, data);
    } catch (error) {
      console.log(' error', error);
    }
  }



  deleteDataJobType(id) {
    try {
      return this.http.delete(this.url + '/jobType/deleteDataJobType/' + id);
    } catch (error) {
      console.log(' error', error);
    }
  }

  searchDataJobType(data) {
    try {
      return this.http.post(this.url + '/jobType/searchListJobType', data);
    } catch (error) {
      console.log(' error', error);
    }
  }



  //--------------------------------end jobtype---------------------------------------//




 //--------------------------------start save work---------------------------------------//


 saveWork(data: any) {
  console.log("RequestService -> saveWork -> data", data)
  try {
    return this.http.post(this.url + '/saveWork/createWork', data);
  } catch (error) {
    console.log(' error', error);
  }
}

getAllDataWork() {
  try {
    return this.http.get(this.url + '/saveWork/getDataWork');
  } catch (error) {
    console.log(' error', error);
  }
}


getDataWorkeByIdForUpdate(id) {
  try {
    return this.http.get(this.url + '/saveWork/getDataWorkforupdate/' + id);
  } catch (error) {
    console.log('error',error );
  }
}


updateDataWork(id, data) {
  try {
    return this.http.put(this.url + '/saveWork/updateWork/' + id, data);
  } catch (error) {
    console.log(' error', error);
  }
}



deleteDataWork(id) {
  try {
    return this.http.delete(this.url + '/saveWork/deleteDataWork/' + id);
  } catch (error) {
    console.log(' error', error);
  }
}

searchDataWork(data) {
  // console.log("RequestService -> searchDataWork -> data", data)
  try {
    return this.http.post(this.url + '/saveWork/searchListWork', data);
  } catch (error) {
    console.log(' error', error);
  }
}


getHolidays() {
  try {
    return this.http.get(this.url + '/holiday/getDataHoliday');
  } catch (error) {
    console.log(' error', error);
  }
}


getHolidays2() {
  return [
      new Date(2021, 4, 27),
      new Date(2021, 6, 4)
  ];
}






 //--------------------------------end save work---------------------------------------//









}
