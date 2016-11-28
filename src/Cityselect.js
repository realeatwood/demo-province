import React from 'react';
import './cityselect.css'
import ReactCSSTransitionGroup from 'react-addons-css-transition-group'

//传参e代表对象省、市、区，i代表对应角标；
class Cityselectwrap extends React.Component{
  constructor(props) {
      super(props);
      this.state = {
          chineseArea:[],    // 全省地区
          cities:[],        // 对应市地区
          areas:[],         // 对应乡镇
          cityShow: false,  //显示城市
          areaShow: false,  //显示行政区
          currentPro: undefined,  //当前省
          currentCity: undefined,  //当前市
          selectedCity: { //选中城市
              provinceName: "",
              cityName: "",
              countyName: "",
              cityVal:""
          },
          inputFocus: false
      }
  }
  componentWillMount(){
      fetch("http://api.jgjapp.com/jlcfg/cities?level=1&citycode=0&platform=w",{
        method:"GET",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
      }).then(response => response.json())
      .then(data => {
        this.setState({
          chineseArea:data.values
        })
      })

  }

  // 更新对应城市列表
  upDataCity(level,city){
    fetch(`http://api.jgjapp.com/jlcfg/cities?level=${level}&citycode=${city.city_code}&platform=w`,{
      method:"GET",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
    }).then(response => response.json())
    .then(data => {
      this.setState({
                cities:data.values,
                cityShow: true,
                areaShow: false,
                currentPro: city.city_name,
                selectedCity: Object.assign({},{
                  provinceName:city.city_name,
                })
            })
    })
  }

    // 更新对应乡镇列表
  upDataArea(level,city){
    fetch(`http://api.jgjapp.com/jlcfg/cities?level=${level}&citycode=${city.city_code}&platform=w`,{
      method:"GET",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
    }).then(response => response.json())
    .then(data => {
      // console.log(data.values);

      this.setState({
                areas:data.values,
                areaShow: true,
                currentCity: city.city_name,
                selectedCity: Object.assign(this.state.selectedCity,{
                  cityName:city.city_name,
                })
            })
    })
  }

  //选择最终地区
  setArea(e) {
    console.log(e);
    // console.log(this.state.currentPro,this.state.currentCity,e);
      this.setState({
        selectedCity: Object.assign(this.state.selectedCity,{
          countyName:e.city_name,
          cityVal:e.city_code,
          // parent_id:e.parent_id,
          // first_char:e.first_char
        })
      })
      console.log(this.state.selectedCity);
  }

  render(){
    return (
      <div>
        <Cityselect {...this.state}
          upDataCity={(level,city) => this.upDataCity(level,city)}
          setArea={(e,i) => this.setArea(e,i)}
          upDataArea={(level,city) => this.upDataArea(level,city)}
          />
      </div>
    )
  }
}



class Cityselect extends React.Component {

    render() {

        let listProvinces = this.props.chineseArea.map((e, i) => <li key={i}>
            <span className={this.props.currentPro === e.city_name
                ? "select"
                : ""} onClick={() => this.props.upDataCity(2,e)}>{e.city_name}</span>
        </li>)
        return (
            <div className="bar bar-header-secondary">
                <div className="searchbar">
                    <div className='headerwrap'>
                        <a className="searchbar-cancel">
                            <svg x="0px" y="0px" viewBox="0 0 9.5 15" style={{
                                enableBackground: 'new 0 0 9.5 15'
                            }}>
                                <path style={{
                                    fill: "#d7252c"
                                }} d="M9.1,14.6L9.1,14.6c-0.6,0.6-1.5,0.6-2.1,0L0,7.5l7-7.1c0.6-0.6,1.5-0.6,2.1,0l0,0
            	c0.6,0.6,0.6,1.5,0,2.1l-4.9,5l4.9,5C9.6,13.1,9.6,14,9.1,14.6z"/>
                            </svg>返回</a>
                        <h3>新工作</h3>
                        <a>已联系</a>
                    </div>
                    <div className="search-input">
                        <input type="text" ref="name" id='search' autoComplete="off" />
                    </div>
                    <div className="selectWraptitle">直接选择</div>
                    <div className="cityselectwrap">
                        <div style={{
                            'height': '100%'
                        }}>
                            <ul className="provinceswrap">
                                {listProvinces}
                            </ul>

                            <ReactCSSTransitionGroup transitionName="rightToleft" transitionEnterTimeout={500} transitionLeave={false}>
                                {this.props.currentPro !== undefined &&
                                  this.props.cityShow === true &&
                                  <Citys cityShow={this.props.cityShow}
                                    province={this.props.cities}
                                    upDataArea={(level,city) => this.props.upDataArea(level,city)}/>}

                                {this.props.currentCity !== undefined &&
                                  this.props.currentPro !== undefined &&
                                  this.props.areaShow === true &&
                                  <Areas setArea={(e, i) => this.props.setArea(e, i)}
                                    city={this.props.areas}
                                    areaShow={this.props.areaShow}/>}
                             </ReactCSSTransitionGroup>
                        </div>
                    </div>

                </div>
            </div>
        )
    }
}

//城市组件
class Citys extends React.Component {

    render() {
        const { province,upDataArea } = this.props;
        const citylist = province.map((e, i) => <li key={i} onClick={() => upDataArea(2,e)}>
            <span>{e.city_name}</span>
        </li>)
        return (
            <div className='listwrap'>
                <ul className={this.props.cityShow
                    ? "cityswrap-show"
                    : ""}>
                    <li>
                        <span>全省</span>
                    </li>
                    {citylist}
                </ul>
            </div>
        )
    }
}
//
//区域组件
class Areas extends React.Component {
    render() {
        const {city} = this.props;
        const arealist = city.map((e, i) => <li key={i} onClick={() => this.props.setArea(e)}>
            <span>{e.city_name}</span>
        </li>)
        return (
            <div className='areawrap'>
                <ul className={this.props.areaShow
                    ? "areawrap-show"
                    : "areawrap"}>
                    {arealist}
                </ul>
            </div>
        )
    }
}

export default Cityselectwrap;
