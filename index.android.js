/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 */
'use strict';

var React = require('react-native');

var {
  AppRegistry,
    Animated,
    Image,
    ListView,
  StyleSheet,
  Text,
  View,
} = React;


var API_KEY = '7waqfqbprs7pajbz28mqf6vz';
var API_URL = 'http://api.rottentomatoes.com/api/public/v1.0/lists/movies/in_theaters.json';
var PAGE_SIZE = 25;
var PARAMS = '?apikey=' + API_KEY + '&page_limit=' + PAGE_SIZE;
var REQUEST_URL = API_URL + PARAMS;

var ReactApp = React.createClass({
  getInitialState:function(){
    return {
      dataSource: new ListView.DataSource({
        rowHasChanged: (row1, row2) => row1 !== row2,
      }),
      loaded: false,
      bounceValue: new Animated.Value(0),
    };
  },
  componentDidMount:function(){
    this.fetchData();
    this.state.bounceValue.setValue(1.5);
    Animated.spring(
        this.state.bounceValue,
        {
          toValue:0.8,
          friction:1,
        }
    ).start();
  },
  fetchData: function() {
    fetch(REQUEST_URL)
        .then((response) => response.json())
        .then((responseData) => {
          this.setState({
            dataSource:this.state.dataSource.cloneWithRows(responseData.movies),
            loaded:true,
          });
        })
        .done();
  },
  render: function() {
    if (!this.state.loaded) {
      return this.renderLoadingView();
    }

    return (
        <ListView
            dataSource={this.state.dataSource}
            renderRow={this.renderMovie}
            style={styles.listView}
            />
    );
  },
  renderLoadingView:function(){
    return(
        <View style={styles.container}>
          <Text>
            正在加载电影数据......
          </Text>
        </View>
    );
  },
  renderMovie:function(movie){
    return(
        <View style={styles.container}>
          <Animated.Image
              source={{uri:movie.posters.thumbnail}}
              style={[
                  styles.thumbnail,
                  {transform: [                        // `transform`是一个有序数组（动画按顺序执行）
                    {scale: this.state.bounceValue},  // 将`bounceValue`赋值给 `scale`
                  ]}
              ]}
              />
          <View style={styles.rightContainer}>
            <Text style={styles.title}>{movie.title}</Text>
            <Text style={styles.year}>{movie.year}</Text>
          </View>
        </View>
    );
  }
});

var styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection:'row',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F5FCFF',
  },
  rightContainer:{
    flex:1,
  },
  title:{
    fontSize:20,
    marginBottom:8,
    textAlign:'center',
  },
  year:{
    textAlign:'center',
  },
  thumbnail:{
    width:100,
    height:81,
  },
  welcome: {
    fontSize: 20,
    textAlign: 'center',
    margin: 10,
  },
  instructions: {
    textAlign: 'center',
    color: '#333333',
    marginBottom: 5,
  },
  listView:{
    paddingTop:20,
    backgroundColor:'#f5fcff',
  },
});

AppRegistry.registerComponent('ReactApp', () => ReactApp);
