// https://scotch.io/tutorials/building-a-morphing-hamburger-menu-with-css

import React from 'react';
import {
  Animated,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';

const Close = ({ color, onPress, size, style, ...rest }) => (
  <View {...rest} style={[style, { justifyContent: 'center', width: size, height: size }]}>
  <TouchableOpacity onPress={onPress}>
    <View style={{ justifyContent: 'center', width: size, height: size }}>
  	<View
      style={{
    		backgroundColor: color,
				height: 2,
        width: size,
        transform: [{
          rotate: '45deg',
				}, {
					translateY: 1
        }]
      }}
    />
  	<View
      style={{
    		backgroundColor: color,
				height: 2,
        width: size,
        transform: [{
          rotate: '-45deg'
				}, {
					translateY: -1
        }]
      }}
    />
	  </View>
  </TouchableOpacity>
  </View>
);

class NavItem extends React.Component {
	constructor() {
		super();
		this.state = { animated: new Animated.Value(0) };
	}

	componentDidMount() {
		if (this.props.open) {
			this.open();
		}
	}

	componentDidUpdate(prevProps) {
		if (!prevProps.open && this.props.open) {
			this.open();
		} else if (prevProps.open && !this.props.open) {
			this.close();
		}
	}

	open() {
		Animated.spring(this.state.animated, {
			toValue: 1
		}).start();
	}

	close() {
		Animated.spring(this.state.animated, {
			toValue: 0
		}).start();
	}

	render() {
		const height = this.state.animated.interpolate({
			inputRange: [0, 1],
      outputRange: [7, 40]
		});
		const scaleY = this.state.animated.interpolate({
			inputRange: [0, 1],
      outputRange: [0.2, 1]
		});
		const backgroundColor = this.state.animated.interpolate({
			inputRange: [0, 1],
      outputRange: ['#EC7263FF', '#EC726300']
		});
		const color = this.state.animated.interpolate({
			inputRange: [0, 1],
      outputRange: ['#EC726300', '#EC7263FF']
		});
		const opacity = this.props.i < 3 ? 1 : this.state.animated;

		return (
      <Animated.View style={[
	      { height, backgroundColor, opacity, transform: [{ scaleY }] }
			]}>
      	<Animated.Text style={styles.navItemText, { color, height }}>{this.props.children}</Animated.Text>
      </Animated.View>
		);
	}
}

class ModalBackdrop extends React.Component {
	constructor() {
		super();
		this.state = { animation: new Animated.Value(0) };
	}

	componentDidMount() {
		Animated.spring(this.state.animation, {
			toValue: 1
		}).start();
	}

	render() {
		const { animation } = this.state;
		const backgroundColor = animation.interpolate({
			inputRange: [0, 1],
      outputRange: ['rgba(0, 0, 0, 0)', 'rgba(0, 0, 0, 0.3)']
		});
		return (
			<Animated.View
				style={{
					position: 'absolute', top: 0, left: 0, bottom: 0, right: 0,
      		backgroundColor, zIndex: 2
				}}
			/>
		);
	}
}

class Menu extends React.Component {
  constructor({ open }) {
    super();
    this.state = {
      animated: new Animated.Value(open ? 1 : 0)
    };
  }

  componentDidUpdate(prevProps) {
    if (this.props.open && !prevProps.open) {
      this.open();
    } else if (!this.props.open && prevProps.open) {
      this.close();
    }
  }

	onClose = () => {
    this.props.onChange();
  }

  close = () => {
    Animated.spring(this.state.animated, {
      toValue: 0
    }).start();
  }

  onOpen = () => {
    this.props.onChange();
  }

  open = () => {
    Animated.spring(this.state.animated, {
      toValue: 1
    }).start();
  }

	renderList(open) {
    const translate = this.state.animated.interpolate({
      inputRange: [0, 1],
      outputRange: [0, 50]
    });
    return (
      <Animated.View style={[styles.nav, {
        transform: [{
          translateX: translate,
        }, {
          translateY: translate,
        }]
      }]}>
        {React.Children.map(this.props.children, (child, i) => (
          React.cloneElement(child, { i, open })
        ))}
      </Animated.View>
    );
  }

  render() {
    const { open } = this.props;
    const height = this.state.animated.interpolate({
      inputRange: [0, 1],
      outputRange: [25 + 20 + 25, 25 + 20 + 25 + 40 * 4 + 25]
    });
    const width = this.state.animated.interpolate({
      inputRange: [0, 1],
      outputRange: [25 + 20 + 25, 300]
    });

		return (
			<View>
        <Animated.View style={{ height, width }}>
        	{open && <Close onPress={this.onClose} size={20} color='#EC7263' style={styles.menuClose}/>}
          {open
      			? this.renderList(open)
    				: (
              <TouchableOpacity onPress={this.onOpen}>
                {this.renderList(open)}
              </TouchableOpacity>
            )}
        </Animated.View>
			</View>
    );
  }
}

const Circle = ({ color, size }) => (
  <View style={{ backgroundColor: color, width: size, height: size, borderRadius: size / 2 }}/>
);
const BlockText = ({ width }) => (
	<View style={{ height: 10, marginHorizontal: 5, borderRadius: 5, backgroundColor: '#C06162', width }}/>
);

class App extends React.Component {
	constructor() {
    super();
    this.state = { open: false };
  }

  toggleMenu = () => this.setState(({ open }) => ({ open: !open }));

  render() {
    return (
      <View style={styles.container}>
      	<Menu open={this.state.open} onChange={this.toggleMenu}>
          <NavItem>DASHBOARD</NavItem>
          <NavItem>HISTORY</NavItem>
          <NavItem>STATISTICS</NavItem>
          <NavItem>SETTINGS</NavItem>
      	</Menu>
      	<View style={styles.content}>
      		<Circle color='#EC7263' size={75}/>
      		<View style={{ flexDirection: 'row', marginTop: 15, marginBottom: 30 }}>
      			<BlockText width={50}/>
      			<BlockText width={80}/>
      		</View>
      		<View>
    	 			<View style={{ width: 200, height: 300, backgroundColor: '#FEBE7E', zIndex: 1 }}/>
			      <View style={{ width: 125, height: 210, backgroundColor: '#C28683', position: 'absolute', top: 44, left: -25 }}/>
			      <View style={{ width: 125, height: 210, backgroundColor: '#958C6B', position: 'absolute', top: 44, right: -25 }}/>
	      	</View>
		      {this.state.open && <ModalBackdrop/>}
      	</View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#533557',
    paddingTop: 20
  },
  content: {
    flex: 1,
    alignItems: 'center',
    paddingTop: 25
	},
  menuClose: {
    margin: 25,
    position: 'absolute',
    top: 0,
    left: 0
  },
  nav: {
    flexDirection: 'column',
    marginTop: 25,
   	marginRight: 25,
    marginBottom: 20,
    marginLeft: 25,
  },
  navItemText: {
    lineHeight: 40,
    fontSize: 21,
  }
});

export default App;
