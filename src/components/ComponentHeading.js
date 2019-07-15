import React, { Component } from 'react';
import { Typography } from '@material-ui/core';
import { withStyles } from '@material-ui/core/styles';


const styles = theme => ({
    root: {
        backgroundColor: '#3e51b5',
        color: 'white',
        padding: '10px 0px'
      },
});

class ComponentHeading extends Component {
    render() {
        const { classes  } =  this.props
        var { color, styleColor, text } = this.props.data
        if(!color){
            color  = "inherit"
        }
        if(!styleColor){
            styleColor = null
        }
        return (
            <Typography  color={color} style={{backgroundColor: styleColor}} align="center" className={classes.root}>
                {text}
            </Typography>
        )
    }
}


export default withStyles(styles)(ComponentHeading);