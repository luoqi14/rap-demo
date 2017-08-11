/**
 * Created by dashuai on 17-6-15.
 */

const styles = {
    td:{
        textAlign:'center'
    },
    tr:{
        textAlign:'center'
    }
};

class JsonModule extends React.Component {

    _checkJsonString = (str)=>{
        if (typeof str == 'string') {
            try {
                JSON.parse(str);
                return true;
            } catch(e) {
                console.log(e);
                return false;
            }
        }
    }

    constructor(props) {
        super(props);
        this.state={
            jsonList:[],
            showAddJsonModal:false,
            showDeleteJsonModal:false,
            showUpdateJsonModal:false,
            addModalName:'',
            addModalDescribe:'',
            addModalAddition:'',
            addModalJsonStr:'',
            showJsonModal:false,
            showJsonData:'',
            selectJsonObj:'',
        }
    }

    _showAddJsonModal = ()=>{
        this.setState({
            showAddJsonModal:!this.state.showAddJsonModal,
        });
    }

    _showDeleteJsonModal = (item,key)=>{
        this.setState({
            showDeleteJsonModal:!this.state.showDeleteJsonModal,
        });
    }

    _showUpdateJsonModal = (item,key)=>{
        this.setState({
            showUpdateJsonModal:!this.state.showUpdateJsonModal,
        });
    }

    componentWillMount(){
        this._requestAllJson();
    }

    _requestAllJson　= ()=>{
        fetch("/org/group/getCommonJson.do")
            .then(response=>response.json())
            .then(response=>{
                console.log(JSON.stringify(response,null,4));
                this.setState({
                    jsonList:response,
                });
            }).catch(err=>{
            console.log(JSON.stringify(err,null,4));
        })
    }

    _addJsonBtn = ()=>{
        const {addModalName,addModalDescribe,addModalAddition,addModalJsonStr} = this.state;

        if(addModalName === ''||addModalJsonStr === ''){
            alert('名称和内容均不能为空！')
            return;
        }

        if (!this._checkJsonString(addModalJsonStr)){
            alert('json格式错误！')
            return;
        }

        fetch("/org/group/addCommonJson.do", {
            method: "POST",
            headers: {
                "Content-Type": "application/x-www-form-urlencoded"
            },
            body:
                `jsonName=${addModalName}&jsonData=${addModalJsonStr}&describe=${addModalDescribe}&addition=${addModalAddition}`
        }).
        then(response=>response.json()).
        then(data=>{
            console.log(JSON.stringify(data,null,4));
            if(data.code === 0){
                this._requestAllJson();
            }else {
                alert(data.msg);
            }
            this._showAddJsonModal();
        });
    }

    _clickShowJsonModal = (item)=>{
        this._showJsonModal();
        this.setState({showJsonData:item.item.data});
    }

    _showJsonModal = ()=>{
        this.setState({showJsonModal:!this.state.showJsonModal});
    }

    _deleteJson = ()=>{
        const {selectJsonObj} = this.state;
        if(!selectJsonObj&&!selectJsonObj.id){
            alert('操作出错！')
            return;
        }

        fetch("/org/group/deleteCommonJson.do", {
            method: "POST",
            headers: {
                "Content-Type": "application/x-www-form-urlencoded"
            },
            body: `jsonId=${selectJsonObj.id}`
        }).
        then(response=>response.json()).
        then(data=>{
            if(data.code === 0){
                this._requestAllJson();
            }else {
                alert(data.msg);
            }
            this._showDeleteJsonModal();
        });
    }

    _updateJsonBtn = ()=>{
        const {selectJsonObj} = this.state;

        if(!selectJsonObj){
            alert('操作出错！')
            return;
        }

        const {name,id,data,describe,addition} =selectJsonObj;

        if(!name || !data || !id){
            alert('操作出错！')
            return;
        }

        if (!this._checkJsonString(data)){
            alert('json格式错误！')
            return;
        }

        fetch("/org/group/updateCommonJson.do", {
            method: "POST",
            headers: {
                "Content-Type": "application/x-www-form-urlencoded"
            },
            body:`jsonName=${name}&jsonData=${data}&describe=${describe}&addition=${addition}&jsonId=${id}`
        }).
        then(response=>response.json()).
        then(data=>{
            if(data.code === 0){
                this._requestAllJson();
            }else {
                alert(data.msg);
            }
            this._showUpdateJsonModal();
        });
    }

    render() {

        const {
            Button,
            ButtonToolbar,
            DropdownButton,
            MenuItem,
            SplitButton,
            Modal,
            FormGroup,
            ControlLabel,
            FormControl,
            FieldGroup,
            PageHeader,
            Panel,
            Table,
        } = ReactBootstrap;

        return (
            <div>
                <Panel　header={<span style={{fontsize:24}}>自定义数据类型</span>}>
                    <ButtonToolbar>
                        <Button
                            bsStyle="primary"
                            onClick={()=>this._showAddJsonModal()}
                        >
                            添加数据类型
                        </Button>
                    </ButtonToolbar>
                    <br/>
                    <Table striped bordered condensed hover>
                        <thead>
                        <tr>
                            <th style={styles.td}>序号</th>
                            <th style={styles.td}>名称</th>
                            <th style={styles.td}>说明</th>
                            <th style={styles.td}>备注</th>
                            <th style={styles.td}>查看</th>
                            <th style={styles.td}>操作</th>
                        </tr>
                        </thead>
                        <tbody>
                        {
                            this.state.jsonList.map((item,key)=>{
                                return(
                                    <tr key={key}>
                                        <td style={styles.td}>{key}</td>
                                        <td style={styles.td}>{item.name}</td>
                                        <td style={styles.td}>{item.describe}</td>
                                        <td style={styles.td}>{item.addition}</td>
                                        <td style={styles.td}>
                                            <Button
                                                bsStyle="primary"
                                                onClick={()=>this._clickShowJsonModal({item})}
                                            >
                                              点击查看
                                            </Button>
                                        </td>
                                        <td>
                                            <ButtonToolbar style={styles.td}>
                                                <Button
                                                    bsStyle="danger"
                                                    onClick={()=>{
                                                        this._showDeleteJsonModal(item,key);
                                                        this.setState({selectJsonObj:item})
                                                    }}
                                                >
                                                    删除
                                                </Button>
                                                <Button
                                                    bsStyle="warning"
                                                    onClick={()=>{
                                                        this._showUpdateJsonModal(item,key);
                                                        this.setState({selectJsonObj:item});
                                                    }}
                                                >
                                                    修改
                                                </Button>
                                            </ButtonToolbar>
                                        </td>
                                    </tr>
                                )
                            })
                        }
                        </tbody>
                    </Table>
                </Panel>

                <Modal show={this.state.showAddJsonModal}>
                    <Modal.Header>
                        <Modal.Title>添加数据类型</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <FormGroup
                            controlId="formControlsTextarea"
                        >
                            <ControlLabel>请输入名称(必填)</ControlLabel>
                            <FormControl
                                onChange={(e)=>this.setState({addModalName:e.target.value})}
                                type="text"
                                placeholder="Enter text"
                            />
                            <ControlLabel>请输入说明</ControlLabel>
                            <FormControl
                                onChange={(e)=>this.setState({addModalDescribe:e.target.value})}
                                type="text"
                                placeholder="Enter text"
                            />
                            <ControlLabel>请输入备注</ControlLabel>
                            <FormControl
                                onChange={(e)=>this.setState({addModalAddition:e.target.value})}
                                type="text"
                                placeholder="Enter text"
                            />
                            <ControlLabel>请输入内容</ControlLabel>
                            <FormControl
                                onChange={(e)=>this.setState({addModalJsonStr:e.target.value})}
                                style={{minHeight: '300px'}}
                                componentClass="textarea"
                                placeholder="请输入内容"
                            />
                        </FormGroup>
                    </Modal.Body>
                    <Modal.Footer>
                        <Button onClick={() => this._showAddJsonModal()}>取消</Button>
                        <Button onClick={() => this._addJsonBtn()} bsStyle="primary">保存</Button>
                    </Modal.Footer>
                </Modal>

                <Modal show={this.state.showDeleteJsonModal}>
                    <Modal.Header>
                        <Modal.Title>删除当前数据类型</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        确定删除当前数据类型？
                    </Modal.Body>
                    <Modal.Footer>
                        <Button onClick={()=>this._deleteJson()}>确定</Button>
                        <Button onClick={()=>this._showDeleteJsonModal()} bsStyle="primary">取消</Button>
                    </Modal.Footer>
                </Modal>

                <Modal show={this.state.showJsonModal}>
                    <Modal.Header>
                        <Modal.Title>当前内容</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <pre>
                            {
                                this.state.showJsonData == '' || this.state.showJsonData == null
                                    ?
                                    null
                                    :
                                    JSON.stringify(JSON.parse(this.state.showJsonData),null,2)
                            }
                        </pre>
                    </Modal.Body>
                    <Modal.Footer>
                        <Button onClick={()=>this._showJsonModal()} bsStyle="primary">关闭</Button>
                    </Modal.Footer>
                </Modal>

                <Modal show={this.state.showUpdateJsonModal}>
                    <Modal.Header>
                        <Modal.Title>修改数据类型</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <FormGroup
                            controlId="formControlsTextarea"
                        >
                            <ControlLabel>请输入名称(必填)</ControlLabel>
                            <FormControl
                                onChange={(e)=>{
                                    let v = this.state.selectJsonObj;
                                    v.name = e.target.value;
                                    this.setState({selectJsonObj:v});
                                }}
                                type="text"
                                placeholder="Enter text"
                                value={this.state.selectJsonObj && this.state.selectJsonObj.name
                                    ?
                                    this.state.selectJsonObj.name
                                    :
                                    ''
                                }
                            />
                            <ControlLabel>请输入说明</ControlLabel>
                            <FormControl
                                onChange={(e)=>{
                                    let v = this.state.selectJsonObj;
                                    v.describe = e.target.value;
                                    this.setState({selectJsonObj:v});
                                }}
                                type="text"
                                placeholder="请输入说明"
                                value={this.state.selectJsonObj && this.state.selectJsonObj.describe
                                    ?
                                    this.state.selectJsonObj.describe
                                    :
                                    ''
                                }
                            />
                            <ControlLabel>请输入备注</ControlLabel>
                            <FormControl
                                onChange={(e)=>{
                                    let v = this.state.selectJsonObj;
                                    v.addition = e.target.value;
                                    this.setState({selectJsonObj:v});
                                }}
                                type="text"
                                placeholder="请输入备注"
                                value={this.state.selectJsonObj && this.state.selectJsonObj.addition
                                    ?
                                    this.state.selectJsonObj.addition
                                    :
                                    ''
                                }
                            />
                            <ControlLabel>请输入内容</ControlLabel>
                            <FormControl
                                onChange={(e)=>{
                                    let v = this.state.selectJsonObj;
                                    v.data = e.target.value;
                                    this.setState({selectJsonObj:v});
                                }}
                                style={{minHeight:'300px'}}
                                componentClass="textarea"
                                placeholder="请输入内容"
                                value={this.state.selectJsonObj && this.state.selectJsonObj.data
                                    ?
                                    this.state.selectJsonObj.data
                                    :
                                    ''
                                }
                            />
                        </FormGroup>
                    </Modal.Body>
                    <Modal.Footer>
                        <Button onClick={()=>this._showUpdateJsonModal()}>取消</Button>
                        <Button onClick={()=>this._updateJsonBtn()} bsStyle="primary">保存</Button>
                    </Modal.Footer>
                </Modal>
            </div>
        )
    }
}

ReactDOM.render(<JsonModule/>, document.getElementById('jsonModule'));