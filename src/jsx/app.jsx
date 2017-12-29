import React from 'react';
import ReactDOM from 'react-dom';

class LogDetails extends React.Component{
    constructor(props){
        super(props);
        this.state = {
            buttonText: "Start game!",
            userName: this.props.userName,
            userMail: this.props.userMail,
            actionLogInfo: ''
        }
    }
    handleNameChange = (e) => {
        if( typeof this.props.handleNameChange === 'function'){
            this.props.handleNameChange(e);
        }
    }
    handleMailChange = (e) => {
        if( typeof this.props.handleMailChange === 'function'){
            this.props.handleMailChange(e);
        }
    }
    userExists(){
        let exists = false;
        for (let i = 0; i < this.props.users.length; i++) {
            if (this.props.userName == this.props.users[i].name && this.props.userMail !== this.props.users[i].mail) {
                exists = true;
            }
        }
        return exists;
    }
    handleLogClick = (e) => {
            if (this.props.userMail.length == 0 || this.props.userName.length == 0) {
                this.setState({
                    actionLogInfo: "Fill the form!"
                })
            } else if (this.props.userMail.indexOf('@') < 0) {
                this.setState({
                    actionLogInfo: "Wrong e-mail adress!"
                })
            } else if (this.userExists()) {
                this.setState({
                    actionLogInfo: "User "+this.props.userName+" already exists! Pick another user name. If you're "+this.props.userName+" - check again your e-mail adress."
                })
            }else {
                this.setState({
                    actionLogInfo: "",
                    displayLog: false,
                    displayChallenge: true
                },() => {
                    let existed = this.findUser();
                    if(existed) {
                        this.props.actionLogin(true, false);
                    }else{
                        this.props.actionLogin(true, true);
                        const newGame = {
                            name: this.props.userName,
                            mail: this.props.userMail,
                            money: 500
                        };
                        fetch('http://localhost:3000/users',{
                            method: 'POST',
                            body: JSON.stringify(newGame),
                            headers: {"Content-Type" : "application/json"}
                        }).then(console.log(newGame));
                    }
                });
            }
    }
    componentDidUpdate(){
        this.checkUser();
    }
    findUser(){
        let found = false;
        for (let i = 0; i < this.props.users.length; i++) {
            if (this.props.userName == this.props.users[i].name && this.props.userMail == this.props.users[i].mail) {
                found = true;
            }
        }
        return found;
    }
    checkUser(){
        if(this.state.userName != this.props.userName || this.state.userMail != this.props.userMail) {

            if(this.findUser()) {
                this.setState({
                    buttonText: "Resume game!",
                    userName: this.props.userName,
                    userMail: this.props.userMail,
                })
            }else{
                this.setState({
                    buttonText: "Start game!",
                    userName: this.props.userName,
                    userMail: this.props.userMail,
                })
            }
        }
    }
    render(){
        return(<div>
                <p style={{color: 'red'}}>{this.state.actionLogInfo}</p>
                <input onChange={this.handleNameChange} value={this.props.userName} placeholder={'Your user name'}/><br/>
                <input onChange={this.handleMailChange} value={this.props.userMail} placeholder={'Your e-mail adress'}/><br/>
                <button onClick={this.handleLogClick}>{this.state.buttonText}</button>
            </div>
        )
    }
}

class LogPage extends React.Component{
    render(){
        if(this.props.userLogged == true) return false
        return(<div>
                <h2>Type your user name and e-mail adress to star or resume your game</h2>
                <LogDetails newUser={this.props.newUser} actionLogin={this.props.actionLogin} actionLogInfo={this.props.actionLogInfo} handleLogClick={this.props.handleLogClick} userMail={this.props.userMail} users={this.props.users} userName={this.props.userName} handleMailChange={this.props.handleMailChange} handleNameChange={this.props.handleNameChange}/>
            </div>
        )
    }
}

class Upgrades extends React.Component{
    constructor(props){
        super(props)
    }
    render(){
        return(<div>
                <button>Upgrade 1</button>
                <button>Upgrade 2</button>
            </div>
        )
    }
}
class DragRace extends React.Component{
    constructor(props){
        super(props);
        this.state = {
            myTime: 10.14,
            opponentTime: 0,
            myInterval:0,
            opponentInterval:0,
            opponents: "",
            opponentName: "",
            opponentPhoto: ""
        }
    }
    componentWillMount(){
        fetch('https://uinames.com/api/?ext[1]')
            .then(r => r.json())
            .then( data => {
                this.setState({});
                let opponents = Object.keys(data).map(id => data[id]);
                this.setState({
                    opponents: opponents,
                    opponentName: opponents[0]+" "+opponents[1],
                    opponentPhoto: opponents[11]
                });
                console.log(this.state.opponents)
            });
    }
    dragRace = () => {
        var myDragRaceInterval = setInterval(()=>{
            this.setState({
                myInterval: this.state.myInterval+0.01
            });
            if(this.state.myTime == (this.state.myInterval).toFixed(2)){
                clearInterval(myDragRaceInterval)
            }
        },10);
        this.setState({
            opponentTime: (Math.random() * 20 + 10)
        });
        var opponentDragRaceIntrval = setInterval(()=>{
            this.setState({
                opponentInterval: this.state.opponentInterval+0.01
            });
            console.log(this.state.opponentTime)
            if((this.state.opponentTime).toFixed(2) == (this.state.opponentInterval).toFixed(2)){
                clearInterval(opponentDragRaceIntrval)
            }
        },10);
    }
    render(){
        return(<div>
            <h1>{this.props.userName}</h1>
            <h1>{this.state.myInterval.toFixed(2)}</h1>
            <div><img src={this.state.opponentPhoto}/></div>
            <h1>{this.state.opponentName}</h1>
            <h1>{this.state.opponentInterval.toFixed(2)}</h1>
            <button onClick={this.dragRace}>Start!</button>
        </div>)
    }
}
class TimeAttack extends React.Component{
    constructor(props){
        super(props);
        this.state = {
            myTime: 10.14,
            myInterval:0,
        }
    }
    timeAttack = () => {
        var timeAttackInterval = setInterval(()=>{
            this.setState({
                myInterval: this.state.myInterval+0.01
            });
            if(this.state.myTime == (this.state.myInterval).toFixed(2)){
                clearInterval(timeAttackInterval)
            }
        },10);
    }
    render(){
        return(<div>
            <h1>{this.state.myInterval.toFixed(2)}</h1>
            <button onClick={this.timeAttack}>Start!</button>
        </div>)
    }
}
class GameWindow extends React.Component{
    constructor(props){
        super(props);
    }
    render(){
        return(<div>
                <h3>The game window</h3>
                <Upgrades/>
                <TimeAttack/>
                <DragRace userName={this.props.userName}/>
        </div>
        )
    }
}

class App extends React.Component{
    constructor(props){
        super(props);
        this.state = {
            userName: "",
            userMail: "",
            users: null,
            newUser: true,
            displayLog: true,
            userLogged: false
        }
    }

    setLogged = (logged, newUser) => this.setState({userLogged: logged, newUser});


    handleNameChange = (e) => {
        this.setState({
            userName: e.target.value,
        })
    }
    handleMailChange = (e) => {
        this.setState({
            userMail: e.target.value,
        })
    }
    handleChallengeTypeChange = (e) => {
        this.setState({
            challengeType: e.target.value,
        })
    }
    handleChallengeGoal = (e) => {
        this.setState({
            challengeGoal: e.target.value,
        })
    }
    handleLogClick = (e, logged) => {
        if(logged){
            this.setState({
                newUser: false,
            });
        } else {
            if (this.state.userName == "Kuba") {
                this.setState({
                    actionLogInfo: "DUPA"
                })
            }else if (this.state.userMail.length == 0 || this.state.userName.length == 0) {
                this.setState({
                    actionLogInfo: "Fill the form!"
                })
            } else if (this.state.userMail.indexOf('@') < 0) {
                this.setState({
                    actionLogInfo: "Wrong e-mail adress!"
                })
            } else {
                this.setState({
                    actionLogInfo: "",
                    displayLog: false,
                });
            }
        }
    }
    componentDidMount(){
        fetch('http://localhost:3000/users')
            .then(r => r.json())
            .then( data => {
                this.setState({})
                let users = Object.keys(data).map(id => data[id]);
                this.setState({
                    users: users
                })
            });
    }
    render(){
        if (!this.state.users) {
            return <div />
        }
        return(<div className='app'>
                <div className='left'>
                    <h1>Drag Race Game</h1>
                    <p>The best racing game ever</p>
                    <LogPage newUser={this.state.newUser} userLogged={this.state.userLogged} actionLogin={this.setLogged} display={this.state.displayLog} userMail={this.state.userMail} users={this.state.users} userName={this.state.userName} handleMailChange={this.handleMailChange} handleNameChange={this.handleNameChange}/>
                    <GameWindow userName={this.state.userName}/>
                </div>
            </div>
        )
    }
}

document.addEventListener('DOMContentLoaded', function(){
    ReactDOM.render(
        <App />,
        document.getElementById('app')
    );
});
