import React, { Component } from 'react';
import {
    Grid,
    TextField,
    FormControl,
    InputLabel,
    MenuItem,
    Select,
    Button,
    Dialog,
    DialogActions,
    DialogContent,
    DialogContentText,
    DialogTitle,

} from '@material-ui/core';
import ComponentHeading from './ComponentHeading';
import apiUrl from './GlobalUrl';
import { withStyles } from '@material-ui/core/styles';
import { connect } from 'react-redux'
import { displaySnackBar } from '../store/actions/sourceActions'
import PopUpMessages from './PopUpMessages';
import { uploadDialog } from '../store/actions/dialogActions';

import VirtualizedSelect from 'react-virtualized-select';
import "react-virtualized-select/styles.css";
import 'react-virtualized/styles.css'

const styles = theme => ({
    root: {
        flexGrow: 1,
    },
    cursorPointer: {
        cursor: 'pointer',
    },
    uploadPane: {
        marginTop: '4%'
    },
    textField: {
        margin: 10,
    },
    resize: {
        fontSize: '20px'
    },
    selectMenu: {
        width: 180,
        margin: 20
    },
});

class UploadSource extends Component {
    constructor(props) {
        super(props)
        var fileReader;
        this.fileReader = fileReader

    }
    state = {
        versionDetails: [],
        languageDetails: [],
        versionContentCode: '',
        versionContentDescription: '',
        contentType: '',
        year: '',
        license: 'CC BY SA',
        revision: '',
        languageid: '',
        contentid: '',
        languageName: '',
        fileContent: [],
        parsedUsfm: [],
        languageCode: '',
        loading: false,
        display: 'none',
        counter: 0,
    }

    async getVersionData() {
        const data = await fetch(apiUrl + 'v1/bibles', {
            method: 'GET'
        })
        const versionDetails = await data.json()
        this.setState({ versionDetails })
    }

    async getLanguagesData() {
        const data = await fetch(apiUrl + 'v1/languages', {
            method: 'GET'
        })
        const languageDetails = await data.json()
        this.setState({ languageDetails })
    }

    componentDidMount() {
        this.getVersionData()
        this.getLanguagesData()
    }

    displayLanguage = () => {
        return this.state.languageDetails.map(lang => {
            return (
                <MenuItem key={lang.languageId} value={lang.languageName}>{lang.languageName}</MenuItem>
            )
        })
    }

    setLanguage = e => {
        const value = this.state.languageDetails.filter((item) => {
            return item.languageName === e.target.value
        })
        this.setState({ languageName: e.target.value, languageCode: value[0].languageCode, languageid: value[0].languageId })
    }

    setContent = e => {
        const value = this.state.contentDetails.filter((item) => {
            return item.contentType === e.target.value
        })
        console.log(value[0]);
        this.setState({ contentid: value[0].contentId, contentType: e.target.value });
    }

    async uploadVersionDetails(apiData) {
        try {
            const postVersions = await fetch(apiUrl + 'v1/sources/bibles', {
                method: 'POST',
                body: JSON.stringify(apiData)
            })
            const myJson = await postVersions.json()
            this.props.displaySnackBar({
                snackBarMessage: myJson.message,
                snackBarOpen: true,
                snackBarVariant: (myJson.success) ? "success" : "error"
            })
        }
        catch (ex) {
            this.props.displaySnackBar({
                snackBarMessage: "Upload Process Failed",
                snackBarOpen: true,
                snackBarVariant: "error"
            })
        }
    }


    handleSubmit = e => {
        var apiData = {
            'languageCode': this.state.languageCode,
            'contentType': this.state.contentType,
            'versionContentCode': this.state.versionContentCode,
            'versionContentDescription': this.state.versionContentDescription,
            'year': this.state.year,
            'revision': this.state.revision,
            'license': this.state.license,
        }
        this.uploadVersionDetails(apiData)
    }

    render() {
        console.log(this.state)
        const { classes } = this.props

        var languageData = [];
        if (this.state.languageDetails != null) {
			{
				Object.values(this.state.languageDetails).map(lang => {
					languageData.push({
						label: lang.languageName,
						value: lang.languageId,
						code: lang.languageCode,
					});
				});
			}
		}

        return (
                <Dialog
                    open={this.props.uploadPane}
                    aria-labelledby="form-dialog-title"
                >
                    <PopUpMessages />
                    <ComponentHeading data={{ classes, text: "Create Source", styleColor: '#2a2a2fbd' }} />
                    <form className={classes.form} onSubmit={this.handleSubmit}>
                        <DialogTitle id="form-dialog-title"> </DialogTitle>
                        <DialogContent>
                            <DialogContentText>
                                Enter details to create source
                            </DialogContentText>
                            <Grid container spacing={1} item xs={12}>
                                <Grid item xs={6}>
                                    <TextField
                                        onChange={(e) => this.setState({ versionContentDescription: e.target.value })}
                                        id="version-content-description"
                                        label="Version Name"
                                        className={classes.textField}
                                        margin="normal"
                                        variant="outlined"
                                        // style={{ height: '40px' }}
                                        required
                                        inputProps={{
                                            classes: {
                                                input: classes.resize
                                            }
                                        }}
                                    />
                                </Grid>
                                <Grid item xs={6}>
                                    <TextField
                                        onChange={(e) => this.setState({ versionContentCode: e.target.value })}
                                        id="version-code"
                                        label="Version Abbreviation"
                                        className={classes.textField}
                                        margin="normal"
                                        variant="outlined"
                                    />
                                </Grid>
                                <Grid item xs={6}>
                                    <TextField
                                        onChange={(e) => this.setState({ year: e.target.value })}
                                        id="year"
                                        label="Year"
                                        className={classes.textField}
                                        margin="normal"
                                        variant="outlined"
                                    />
                                </Grid>
                                <Grid item xs={6}>
                                    <TextField
                                        onChange={(e) => this.setState({ license: e.target.value })}
                                        id="licence"
                                        label="License"
                                        className={classes.textField}
                                        margin="normal"
                                        variant="outlined"
                                        defaultValue="CC BY SA"
                                    />
                                </Grid>
                                <Grid item xs={6}>
                                    <FormControl className={classes.formControl}>
                                        <InputLabel htmlFor="select-revision">Revision</InputLabel>
                                        <Select
                                            value={this.state.revision}
                                            variant="outlined"
                                            onChange={(e) => this.setState({ revision: e.target.value })}
                                            inputProps={{
                                                name: 'revision',
                                                id: 'select-revision'
                                            }}
                                            className={classes.selectMenu}
                                        >
                                            <MenuItem key={1} value={1}>1</MenuItem>
                                            <MenuItem key={2} value={2}>2</MenuItem>
                                            <MenuItem key={3} value={3}>3</MenuItem>
                                            <MenuItem key={4} value={4}>4</MenuItem>
                                        </Select>
                                    </FormControl>
                                </Grid>
                                <Grid item xs={6}>
                                        <InputLabel htmlFor="select-language">Language</InputLabel>
                                        <VirtualizedSelect className={classes.selectMenu}   
                                        options={languageData}
                                        onChange={(e) => this.setState({ 
                                            languageName: e.label,
                                            languageid:e.value,
                                            languageCode:e.code})}
                                        value={this.state.languageid} 
                                        />
                                </Grid>
                            </Grid>
                        </DialogContent>
                        <DialogActions>
                            <Button 
                            variant="contained" 
                            size="small" 
                            color="secondary" 
                            onClick={() => this.props.uploadDialog({uploadPane: false})}
                            >Close</Button>
                            <Button variant="contained" color="primary" onClick={this.handleSubmit}>Create Source</Button>
                        </DialogActions>
                    </form>
                </Dialog>
        )
    }
}

const mapStateToProps = (state) => {
    return {
        uploadPane: state.dialog.uploadPane
    }
}

const mapDispatchToProps = (dispatch) => {
    return {
        displaySnackBar: (popUp) => dispatch(displaySnackBar(popUp)),
        uploadDialog: (status) => dispatch(uploadDialog(status))
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(withStyles(styles)(UploadSource));