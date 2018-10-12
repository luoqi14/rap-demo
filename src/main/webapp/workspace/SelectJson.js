/**
 * Created by dashuai on 17-6-19.
 */
const styles = {
    container: {
        backgroundColor: '#F2F2F2',
        width: 300,
        height: 500,
    },
    jsonContainer: {
        height: '100%',
    },
    btnStyle: {
        margin: 2,
    }
}

class Panel extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            show:false,
            jsonList: [],
            jsonData: '',
            jsonName: '',
        }
    }

    componentDidMount() {
        this._requestCommonData();
    }

    /**
     * 请求公共模板数据
     * @private
     */
    _requestCommonData = () => {
        fetch("/org/group/getCommonJson.do", {
            method: "POST",
            headers: {
                "Content-Type": "application/x-www-form-urlencoded"
            },
            body: `id=${this.state.id}&productlineId=${this.state.productlineId}`
        })
            .then(response => response.json())
            .then(response => {
                this.setState({
                    jsonList: response,
                });
            }).catch(err => {
            console.log(JSON.stringify(err, null, 4));
        })
    }


    /**
     * 向数据库添加json模板
     * @private
     */
    _addJsonBtn = () => {
        const {jsonName, jsonData} = this.state;
        if (jsonName === '' || jsonData === '') {
            alert('json模板的名称和内容均不能为空！')
            return;
        }

        if (!this._checkJsonString(jsonData)) {
            alert('json格式错误！')
            return;
            return;
        }

        fetch("/workspace/addCommonJson.do", {
            method: "POST",
            headers: {
                "Content-Type": "application/x-www-form-urlencoded"
            },
            body: `jsonName=${jsonName}&jsonData=${jsonData}`
        }).then(response => response.json()).then(data => {
            if (data.code === 0) {
                this._requestCommonData();
            } else {
                alert(data.msg);
            }
            this._showAddJsonModal();
        });
    }

    _handleNameChange = (e) => {
        this.setState({
            jsonName: e.target.value,
        })
    }

    _handleDataChange = (e) => {
        this.setState({
            jsonData: e.target.value,
        })
    }


    render() {

        const {
            Button,
            Modal,
            ListGroup,
            ListGroupItem
        } = ReactBootstrap;

        return (
            <Modal id="select-json-modal">
                <Modal.Header>
                    <Modal.Title>选择自定义json类型</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <div>
                        <ListGroup>
                            {
                                this.state.jsonList.map((item, index) => {
                                    return (
                                        <ListGroupItem>item.name</ListGroupItem>
                                    )
                                })
                            }
                        </ListGroup>
                        <pre
                            id="json-area"
                            style={styles.jsonContainer}
                        >
                            {
                                JSON.stringify(this.state.showJsonText, null, 2)
                            }
                        </pre>
                    </div>
                </Modal.Body>
                <Modal.Footer>
                    <Button onClick={() => ws.hideCustomJsonModal()}>取消</Button>
                    <Button onClick={() => this._addJsonBtn()} bsStyle="primary">保存</Button>
                </Modal.Footer>
            </Modal>
        )
    }
}

ReactDOM.render(<Panel/>, document.getElementById('select-json'));