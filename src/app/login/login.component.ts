import { Component, OnInit } from '@angular/core';
import {Observable} from "rxjs/Observable";
import {HttpClient,HttpHeaders} from "@angular/common/http";
import {Router} from '@angular/router';
import 'rxjs/Rx';
//import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';

import * as _ from 'lodash';


const optionRequete = {
  headers: new HttpHeaders({ 
    'Access-Control-Allow-Origin':'*',
    'mon-entete-personnalise':'maValeur'
  })
};

interface User {
  username: string;
  userdId: string;
  token:string;
}

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  username:'';
  password:'';
  ip_back: '';
  user$: Observable<User>;
  //user;

  constructor(private http:HttpClient,private router: Router) {
  }

  ngOnInit(): void {
    
  }

  login(username, password,ip_back){
    //this.socketService.auth(token);
    console.log('username', username)
    console.log('password', password)
    console.log('ip_back', ip_back)
    //La ip que pone, la voy a guardar en el localstorage
    localStorage.setItem('ip_back', ip_back);
    /*
    this.user$ = this.http
    .get<User>("/courses.json")
    .map(data => _.values(data))
    .do(console.log);*/

    let ip = '';
    ip = localStorage.getItem('ip_back');



    this.http.post('http://'+ ip + '/users/signin',
    //this.http.post("http://localhost:8000/users/signin",
    {
    "email": username,
    "password": password,
    },
    )
    .subscribe(
    (val) => {
      console.log("POST call successful value returned in body", 
      val);
      //Si sale bien -> mando redirect al formulario con el token
      // Absolute route - Goes up to root level with route params   
      //this.router.navigate(['/game', val['token']]);
      if (val['token'])
        this.setSession (val['token'], val['userID'], val['level'], val['name'])
        this.router.navigate(['/game']);
    },
    response => {
      console.log("POST call in error", response);
    },
    () => {
      console.log("The POST observable is now completed.");
    });
  }


  private setSession(token, userID, level, username) {
    localStorage.setItem('token', token);
    localStorage.setItem('userID', userID);
    localStorage.setItem('level', level);
    localStorage.setItem('username', username);
    
} 

}
