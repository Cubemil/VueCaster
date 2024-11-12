# Web Engineering winter semester 2024/2025

## Goal

Creating a [backend](/server-backend/) for our existing [frontend](/web-frontend/) web app [Podcast player](http://webengineering.ins.hs-anhalt.de:10051)

### Functionality

- [ ] Account Management
  - [ ] Registration
  - [ ] Login
  - [ ] Authorization
- [ ] Offline functionality
- [ ] Downloads
- [ ] PWA
- [ ] Desktop App with electron

## Team

### Wiederholer++

- Clemens Abraham
- Felix Gahler
- Emil Petersen

## Tech Stack

### MEVN

- **Vue 3 CLI** *(component based frontend framework)*
- **Node.JS** *(package manager and js runtime for servers)*
- **Express.JS** *(quick and easy node.js-based web backend framework)*
- **MongoDB** *(Database ORM)*

![MEVN architecture](web-frontend/src/assets/mevncrudarchitecture.png)

## Local project setup

***Any command on macOS needs to be called with sudo.***

1. ```npm install -g @vue/cli``` (installs vue framework globally)
2. clone the project and open the root folder in your IDE
3. In the IDE: ```cd web-frontend``` (change into project folder)
4. ```npm i``` (installs 'node_modules' / vue library)
5. ```npm run serve``` (starts live server for web page)
