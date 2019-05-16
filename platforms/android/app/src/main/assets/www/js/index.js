/*
 * Licensed to the Apache Software Foundation (ASF) under one
 * or more contributor license agreements.  See the NOTICE file
 * distributed with this work for additional information
 * regarding copyright ownership.  The ASF licenses this file
 * to you under the Apache License, Version 2.0 (the
 * "License"); you may not use this file except in compliance
 * with the License.  You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing,
 * software distributed under the License is distributed on an
 * "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
 * KIND, either express or implied.  See the License for the
 * specific language governing permissions and limitations
 * under the License.
 */
var app = {
    // Application Constructor
    initialize: function () {
        app.bindEvents();
    },
    bindEvents: function () {
        document.addEventListener("deviceready", app.onDeviceReady, false);
        document.addEventListener("resume", app.onDeviceResume, false);
    },
    // deviceready Event Handler
    //
    // Bind any cordova events here. Common events are:
    // 'pause', 'resume', etc.
    onDeviceReady: function () {
        app.receivedEvent('deviceready');
        console.log('On Device Ready...')
        app.branchInit();
        app.setupPush();
    },
    receivedEvent: function (id) {
        var parentElement = document.getElementById(id);
        var listeningElement = parentElement.querySelector('.listening');
        var receivedElement = parentElement.querySelector('.received');

        listeningElement.setAttribute('style', 'display:none;');
        receivedElement.setAttribute('style', 'display:block;');

        console.log('Received Event: ' + id);
    },
    onDeviceResume: function () {
        app.branchInit();
        app.setupPush();
    },
    branchInit: function () {
        // Branch initialization
        Branch.initSession().then(function (data) {
            if (data["+clicked_branch_link"]) {
                // read deep link data on click
                alert("Deep Link Data: " + JSON.stringify(data));
            }
        });
    },
    setupPush: function () {
        console.log('calling push init');
        var push = PushNotification.init({
            "ios": {
                "sound": true,
                "vibration": true,
                "badge": true
            },
            "android": {
                "senderID": "775453245135",
                "forceShow": false,
            },
            "windows": {}
        });
        console.log('after init');

        push.on('registration', function (data) {
            console.log('registration event: ' + data.registrationId);

            var oldRegId = localStorage.getItem('registrationId');
            if (oldRegId !== data.registrationId) {
                // Save new registration ID
                localStorage.setItem('registrationId', data.registrationId);
                // Post registrationId to your app server as the value has changed
            }
            app.displayElement('.registered')
        });
        push.on('error', function (e) {
            console.log("push error = " + e.message);
        });
        push.on('notification', function (data) {
            app.displayElement('.notification')
            //{"sound":"enabled","title":"Testing123","message":"Testing cordova","additionalData":{"branch":"https:\/\/agjs.test-app.link\/quksqAGIFW","coldstart":false,"foreground":true}}
            const link = data.additionalData.branch;
            console.log(`link received: ${link}`);
            app.getLinkData(link);
        });
    },
    getLinkData: function(link) {
        const encoded = encodeURI(link)
        const request = `https://api2.branch.io/v1/url?url=${encoded}&branch_key=key_test_kaIi9kyqw8N4nfzQUR8yGdnivvf5KDBx`;
        $.ajax({
           type: "GET",
           dataType: 'json',
           url: request,
           success: app.onDataReceived,
           error: app.onDataError
        });
    },
    onDataReceived: function(data) {
        alert(JSON.stringify(data))
    },
    onDataError: function(e) {
        console.error(`Error fetching link data: ${e.message}`)
    },
    displayElement: function (selector) {
        const parentElement = document.getElementById('deviceready');
        const elements = [
            parentElement.querySelector('.listening'),
            parentElement.querySelector('.received'),
            parentElement.querySelector('.notification'),
            parentElement.querySelector('.registered')
        ];
        elements.forEach((e) => e.setAttribute('style', 'display:none;'));
        const display = parentElement.querySelector(selector);
        display.setAttribute('style', 'display:block;');
    }
};

app.initialize();