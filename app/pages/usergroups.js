import React, { Component } from 'react';
import {  Glyphicon, FormControl, FormGroup, Panel} from 'react-bootstrap';
import { addGroup, getUserGroupList, updateUser} from '../service/darts';
import withPage from './withPage';
import { ScaleLoader} from 'react-spinners';
import cookies from 'next-cookies';
import Link from 'next/link';

const validate = (s, l) => s && s.length <= l;

class Usergroups extends Component {
  static async getInitialProps(ctx) {
    const { token, username, description, email, id, is_admin } = cookies(ctx);
    const { res } = ctx;
    const userGroups = await getUserGroupList(token);
    return { 
        userGroups,
        token, 
        username, 
        description,
        email,
        id,
        is_admin
    };
  }

  constructor(props) {
    super(props);
    const{userGroups, username, description, email, id, is_admin} = this.props;
    this.addUserGroup = this.addUserGroup.bind(this);
    this.state = { 
      adding: false,
      numOfGroups: userGroups.length,
      show: false,
      passwordChange : password,
      emailChange: email,
      descriptionChange: description,
      confirmPassword: password
     };
    this.handleShow = this.handleShow.bind(this);
    this.handleClose = this.handleClose.bind(this);
    this.updateProfile = this.updateProfile.bind(this);
  }

  async updateProfile () {
    const{ token, username, description,email, id, is_admin} = this.props;
    const{ passwordChange, emailChange, descriptionChange, confirmPassword}  = this.state;
    if(passwordChange == confirmPassword) {
      const ok = await updateUser(id, name, passwordChange, emailChange, descriptionChange, token); 
    } else window.alert("Password doesn't match");
    if(res.ok) {
      this.freshPage();
    }
  }

  async addUserGroup() {
    const { name, description} = this.state;
    if (validate(name, 255) && validate(description, 512 * 4)) {
      this.setState({ adding: true });
      const ok = await addGroup(name, description);
      this.setState({ adding: false });
      if (ok) {
        this.freshPage();
      }
    }
  }
  handleShow() {
    this.setState({ show: true });
  }
  handleClose() {
    this.setState({ show: false });
  }

  freshPage() {
    const url = window.location.href;
    window.location.href = url;
  }


  render(){
    const { adding } = this.state;
    const { userGroups, username, description,email, id, is_admin } = this.props;

    return(
      <div className="container">
        <style jsx global>{`
          th {
            vertical-align: middle !important;
          }
          .form-group {
            margin-bottom: unset;
          }
          .table-responsive {
            margin-top: 40px;
          }
        `}</style>
        <h3 style={{color:"black", marginBottom:"20px"}}>
            &nbsp;&nbsp; List Of User Groups 
            <Button style={{color: "Darkblue", float:"right"}} onClick={this.handleShow}>My Profile &nbsp;
              <Glyphicon  glyph="user"/>
            </Button>
        </h3>
        {<Modal show={this.state.show} onHide={this.handleClose}>
          <Modal.Header closeButton>
            <Modal.Title>My Profile</Modal.Title>
          </Modal.Header>
          <Modal.Body>
          <Table style={{alignItems: "center", float:"inline-end"}} striped bordered condensed hover>
            <thead>
              <tr>
                <th>Username</th>
                <th>Email</th>
                <th>Company</th>
                <th>&nbsp;</th>
              </tr>
            </thead>
            <tbody>
            {
              <tr>
                <td>{username}</td>
                <td>{email}</td>
                <td>{description}</td>
                <th>&nbsp;</th>
              </tr>
            }
            { 
            <tr >
                <td >
                    <FormGroup style={{float: "left", width:"100%", marginLeft:"0px"}} >
                      <FormControl 
                      type="password"
                      value={this.state.passwordChange}
                      placeholder= "Change Password"
                      onChange={(e) => this.setState({ passwordChange: e.target.value})}
                    />
                  </FormGroup>
                </td>
                <td >
                    <FormGroup style={{float: "left", width:"100%", marginLeft:"0px"}} >
                      <FormControl 
                      type="password"
                      value={this.state.confirmPassword}
                      placeholder= "Confirm Password"
                      onChange={(e) => this.setState({ confirmPassword: e.target.value})}
                    />
                  </FormGroup>
                </td>
                <td >
                    <FormGroup style={{float: "left", width:"100%", marginLeft:"0px"}} >
                      <FormControl 
                      type="text"
                      value={this.state.emailChange}
                      placeholder= "Change email"
                      onChange={(e) => this.setState({ emailChange: e.target.value})}
                    />
                  </FormGroup>
                </td>
                <td >
                    <FormGroup style={{float: "left", width:"100%", marginLeft:"0px"}} >
                      <FormControl 
                      type="text"
                      value={this.state.descriptionChange}
                      placeholder= "Change description"
                      onChange={(e) => this.setState({ descriptionChange: e.target.value})}
                    />
                  </FormGroup>
                </td>
                <td>
                  <Button bsStyle="success" bsSize="small" style={{width:"80%", fontSize:"10pt"}} onClick={this.updateProfile}>Submit</Button>
                </td>
              </tr>}
            </tbody>
          </Table>
            
          </Modal.Body>
          <Modal.Footer>
            <Button onClick={this.handleClose}>Close</Button>
          </Modal.Footer>
        </Modal>}

        {adding && (
          <div style={{display: "flex", justifyContent: "center" }}>
            <ScaleLoader color="4A7443" />
          </div>
        )}
        {
          userGroups && userGroups.map((group, index) => (
            <Panel style={{float: "left", width:"32%", marginRight:"10px"}} key={index} bsStyle="success">
            <Panel.Heading>
              <Panel.Title componentClass="h3" >
                <Link href={`/usergroup/${group.id}`}>
                      <a> {group.name} </a>
                </Link>
              </Panel.Title>
            </Panel.Heading>
            <Panel.Body>{group.description}</Panel.Body>
            </Panel>
          ))
        }
        <Panel bsStyle="info" style={{float:"left", overflow:"hidden", marginTop:"10px", width:"98%"}}>
          <Panel.Heading >
            <Panel.Title componentClass="h3">Create a User Group</Panel.Title>
          </Panel.Heading>
          <Panel.Body>User Groups are used to manage your team members' access to studies. A study can only be viewed and edited by users within the group.</Panel.Body>
            <div  style={{alignItems:"center", marginBottom:"20px"}}>
            <FormGroup style={{float: "left", width:"30%", marginLeft:"20px", marginBottom:"20px"}} validationState={validate(this.state.name, 255) ? "success" : "error" }>
              <FormControl
                type="text"
                value={this.state.name}
                placeholder="Group Name"
                onChange={(e) => this.setState({ name: e.target.value})}
              />
              </FormGroup>
            <FormGroup style={{ float: "left", width:"30%", marginLeft:"20px", marginBottom:"20px"}} validationState={validate(this.state.description, 512 * 4) ? "success" : "error" }>
                <FormControl 
                type="text"
                value={this.state.description}
                placeholder="Group Description"
                onChange={(e) => this.setState({ description: e.target.value})}
              />
            </FormGroup>
            <Glyphicon style={{ float: "left", marginLeft:"15px", color:"Midnightblue", fontSize: "27px"}} glyph="plus" onClick={this.addUserGroup} />
          </div>
        </Panel>
      </div>
    );
  }
}

export default withPage(Usergroups);