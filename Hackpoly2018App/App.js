import React from 'react';
import { 
  StyleSheet, 
  Text, 
  View, 
  Button, 
  TextInput,
  Alert,
  FlatList,
  } from 'react-native';
import {
  List,
  ListItem
} from 'react-native-elements';
import { StackNavigator } from 'react-navigation';

class LoginScreen extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      email: '',
      password: '',
    }
  }

  sendLoginData() {
    const {email} = this.state;
    const {password} = this.state;
    return fetch('http://10.0.17.85:3000/users', {
        method: 'POST',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: email,
          password: password,
        }),
      }).then(res => res.json())
      .then(response => Alert.alert('Success: ', JSON.stringify(response)))
      .catch(error => console.error('Error:', error));
  }

    render() {
    return (
      <View style={styles.homePage}>
        <Text>Login Screen</Text>
        <TextInput
          placeholder="Email"
          onChangeText={email => this.setState({email})}
          underlineColorAndroid='transparent'
          style={styles.TextInputStyle}
        />
        <TextInput
          placeholder="Password"
          onChangeText={password => this.setState({password})}
          underlineColorAndroid='transparent'
          style={styles.TextInputStyle}
        />
        <Button title="Login" 
          onPress={() => this.sendLoginData()} color="#2196f3"
        />
        
        
      </View>
    );
  }
}

class HomeScreen extends React.Component {
  constructor(props) {
    super(props)
    this.state={
      data: [],
    }
  }

  componentDidMount() {
    this.makeRemoteRequest();
  }

  makeRemoteRequest = () => {
    fetch('http://10.0.17.85/', {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
      },
    })
  }

  render() {
    return (
      <View style = {styles.homePage}>
          <Text>Connections</Text>
          <Text>Pending</Text>
          <Text>Requests</Text>
          <Text>Current</Text>
      </View>
    )
  }
}


class TestScreen extends React.Component  {
  constructor(props) {
    super(props)
    this.state = {
      searchTerm: '',
      social: '',
      skills: '',
      name: '',
      location: '',
    }
  }

  sendProfileData() {
    const {social} = this.state;
    const {skills} = this.state;
    const {name} = this.state;
    const {location} = this.state;

    return fetch('http://10.0.17.85:3000/users', {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        social: social,//MAY NEED TO CHANGE KEY INPUTS
        skills: skills,
        name: name,
        location: location,
      }),
    }).then(res => res.json())
    //.then(response => Alert.alert('Success: ', JSON.stringify(response)))//this.setState(uniqueid))
    .catch(error => console.error('Error:', error));
  }

  render() {
    return (
      <View style={styles.homePage}>
        <Text>Home Screen</Text>
        <TextInput
          placeholder="Name"
          onChangeText={name => this.setState({name})}
          underlineColorAndroid='transparent'
          style={styles.TextInputStyle}
        />
        <TextInput
          placeholder="Social"
          onChangeText={social => this.setState({social})}
          underlineColorAndroid='transparent'
          style={styles.TextInputStyle}
        />
        <TextInput
          placeholder="Skills"
          onChangeText={skills => this.setState({skills})}
          underlineColorAndroid='transparent'
          style={styles.TextInputStyle}
        />
        <TextInput
          placeholder="Location"
          onChangeText={location => this.setState({location})}
          underlineColorAndroid='transparent'
          style={styles.TextInputStyle}
        />
        <Button title="Send Profile Data to Server" 
          onPress={() => this.sendProfileData()} color="#2196f3"
        />
        


        <Button
          title="Go To Search"
          onPress={() => this.props.navigation.navigate('Search', {
            name: this.state.name,
          })}
        />
        
      </View>
    );
  }
}

class SearchScreen extends React.Component {
  constructor(props) {
    super(props);
    const { params } = this.props.navigation.state;
    this.state = {
      searchTerm: '',
      data: [],
      name: params.name,
    }
  }

  sendSearchData() {
    const {searchTerm} = this.state;

    return fetch('http://10.0.17.85:3000/search', {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        searchTerm: searchTerm,
      }),
    }).then((res) => res.json())
    .then((response) => {
      this.props.navigation.navigate('Results', {
        data: response,
        name: this.state.name,
      });
    }).catch(error => console.error('Error:', error));
  }

  render() {
    return (
      <View style={styles.profilePage}>
        <Text>Search Page</Text>
        <TextInput
          placeholder="Find a Tag"
          onChangeText={searchTerm => this.setState({searchTerm})}
          underlineColorAndroid='transparent'
          style={styles.SearchInputStyle}
        />
        <Button title="Search" 
          onPress={() => this.sendSearchData()} color="#2196F3"
        />
      </View>
    )
  }
}

class SearchResultsScreen extends React.Component {
  constructor(props) {
    super(props);
    const { params } = this.props.navigation.state;
    this.state = {
      data: JSON.stringify(params.data),
      name: params.name,
    }
  }

  sendRequest(receiverName) {
     return fetch('http://10.0.17.85:3000/connections', {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        sender: this.state.name,
        receiver: receiverName,
      }),
    }).then((res) => res.json())
    .then((response) => {
      Alert.alert('Sent Request!');
    }).catch(error => console.error('Error:', error));
  }

  render() {
    return (
      <List>
        <FlatList data={JSON.parse(this.state.data)}
           renderItem={({ item }) => (
              <ListItem button
                title={`${item.name}`}
                subtitle={item.skills}
                onPress={() => 
                  {this.sendRequest(item.name)}}
              />
            )}
           keyExtractor={item => item.id}
          />
      </List>
    )
  }
}

class ProfileScreen extends React.Component {
  constructor(props) {
    super(props);
    const { params } = this.props.navigation.state;
    this.state = {
      name: params.name,
      skills: params.skills,
      social: params.social,
      location: params.location,
    }
  }

  render() {
    return (
      <View>
        <Text>Profile Screen</Text>
        <Text>this.state.name</Text>
      </View>
    );
  }
}

const RootStack = StackNavigator(
  {
    Test: {
      screen: TestScreen,
    },
    Login: {
      screen: LoginScreen,
    },
    Home: {
      screen: HomeScreen,
    },
    Profile: {
      screen: ProfileScreen,
    },
    Search: {
      screen: SearchScreen,
    },
    Results: {
      screen: SearchResultsScreen,
    },
  },
  {
    initialRouteName: 'Test',
  }
);

export default class App extends React.Component {
  render() {
    return <RootStack/>;
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  homePage: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center'
  },
  profilePage: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center'
  },
  TextInputStyle: {
    textAlign: 'center',
    marginBottom: 7,
    height: 40,
    width: 90,
    ///borderWidth: 1,
    // Set border Hex Color Code Here.
    // borderColor: '#FF5722',
    // Set border Radius.
     //borderRadius: 10 ,
  },
  SearchInputStyle: {
    textAlign: 'center',
    marginBottom: 7,
    height: 40,
    width: 90,
  }
});