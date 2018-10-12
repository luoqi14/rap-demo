/**
 * Created by dashuai on 17-6-15.
 */

const styles = {
    td: {
        textAlign: 'center'
    },
    tr: {
        textAlign: 'center'
    }
};

window.addEventListener('beforeunload', function() {
    ws.customAtionId && rap.project.removeAction(ws.customAtionId);
    ws.customAtionId = undefined;
}, false);

ws.customRefreshType = function() {
    // load the type data
    $.ajax({
        method: "POST",
        url: '/org/group/getCommonJson.do',
        data: 'productlineId=' + window.projectlineId + '&id=' + window.teamId,
        dataType: "json",
        success: function (data) {
            window.cusTypeList = data;
            window.cusTypeSelect = data.map(function(item) {
                return item.name;
            });
        },
        error: function (error) {
            console.log(JSON.stringify(error));
        }
    });
};

// add line for request list
ws.customAddParam = function (type, parentParamId) {
    var newParamId = -1;
    if (type == "child") {
        newParamId = rap.project.addChildParameter(parentParamId);
    } else if (type == "request") {
        newParamId = rap.project.addRequestParameter(ws.customAtionId);
    }
    ws.customRenderAction();
};

// remove the line
ws.customRemoveParam = function (paramId) {
    rap.project.removeParameter(paramId);
    ws.customRenderAction();
};

ws.customRenderAction = function () {
    var action = rap.project.getAction(ws.customAtionId);
    var html = ws.customGetAHtml(action);
    document.getElementById(action.name).innerHTML = html;
}

ws.customGetAHtml = (a, isView) => {
    var str = "",
        requestParameterList = a.requestParameterList,
        responseParameterList = a.responseParameterList,
        requestParameterListNum = requestParameterList.length,
        responseParameterListNum = responseParameterList.length,
        p, i,
        breaker = true;
    str += "<table class=\"table-a\"><tr class=\"head\"><td class=\"head-expander\"></td>"+(!isView ? "<td class=\"head-op\">OP</td>": "") +"<td class=\"head-identifier\">变量名</td><td class=\"head-name\">含义</td><td class=\"head-type\">类型</td><td class=\"head-remark\">备注</td></tr>";
    for (i = 0; i < requestParameterListNum; i++) {
        p = requestParameterList[i];
        str += ws.customGetPTRHtml(p, 0, !isView);
    }
    str += "</table>";
    if (!isView) {
        str += "<div class='btns-container'><a href=\"#\" class=\"btn btn-info btn-xs\" onclick=\"ws.customAddParam('request'); return false;\"><i class='glyphicon glyphicon-plus'></i>添加参数</a>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<a href\"#\" class='btn btn-default btn-xs' onclick=\"ws.importJSON(true); return false;\"><i class='glyphicon glyphicon-transfer'></i>导入JSON</a></div>";
    }

    return str;
};

ws.customGetPTRHtml = function (param, level, editMode, readonly) {
    var subReadonly = stdTypeList.indexOf(param.dataType) <= -1;
    var readonlyAndEdit = editMode;
    var str = "",
        parameterList = param.parameterList,
        parameterListNum = param.parameterList && param.parameterList.length ?
            param.parameterList.length : 0;
    level = level || 0;
    var isEditMode = true;
    if (typeof editMode === 'boolean') {
        isEditMode = editMode;
    }
    if (isEditMode && typeof readonly === 'boolean') {
        readonlyAndEdit = !readonly;
    }
    str += "<tr class='tr-param" + (level > 0 || parameterListNum > 0 ? " param-level-" + level : "") +
        "' id='tr-param-" + param.id + "' onmouseover=\"ws.showOpColumn(event, " +
        param.id + ", " + readonlyAndEdit + "); return false;\"" + "onmouseout=\"ws.hideOpColumn(event, " +
        param.id + ", " + readonlyAndEdit + "); return false;\">";

    // special column, expander
    str += "<td class='expander'" + (isEditMode ? " style='background-color:#E6E6E6;'" : "") + ">";
    if (parameterListNum > 0) {
        str += "<div style='position:relative;width:0;'><div class='more' id='div-param-expander-" + param.id + "' onclick='ws.paramShrink(" +
            param.id + "); return false;' style='width:16px;height:18px;position: absolute;left:-22px;top:-10px;'></div></td>";
    }
    str += "</td>";

    if (isEditMode) {
        str += ws.getPTDHtml(param.id,
            "<div id=\"div-param-op-" + param.id + "\" class=\"div-op-container\" style=\"display:none;\">" +
            "<a href=\"#\" onclick=\"ws.customRemoveParam(" + param.id + "); return false;\"><i class='glyphicon glyphicon-remove'></i></a>" +
            (!subReadonly && (parameterListNum > 0 || param.dataType == "object" || param.dataType == "array<object>") ?
                "<a style=\"margin-left:5px;color:#47a947;\" href=\"#\" onclick=\"ws.customAddParam('child', " +
                param.id + "); return false;\"><i class='glyphicon glyphicon-plus'></i></a>" : "") + "</div>", "op");
    }
    str += ws.getPTDHtml(param.id, util.escaper.escapeInH(param.identifier), "identifier", level, isEditMode, readonly);
    str += ws.getPTDHtml(param.id, util.escaper.escapeInH(param.name), "name", undefined, isEditMode, readonly);
    str += ws.customGetDataTypeEditSelectHtml(param.id, param.dataType, isEditMode, readonly);
    // for remarkFilter, escape after filter processed...
    str += ws.getPTDHtml(param.id, param.remark, "remark", undefined, isEditMode, readonly);
    str += "</tr>";

    for (var i = 0; i < parameterListNum; i++) {
        str += ws.customGetPTRHtml(parameterList[i], level + 1, isEditMode, subReadonly);
    }

    return str;
};

ws.customGetDataTypeEditSelectHtml = function (id, type, editMode, readonly) {
    var str = "";
    var isEditMode = true;
    if (typeof editMode === 'boolean') {
        isEditMode = editMode;
    }
    if (isEditMode && typeof readonly === 'boolean') {
        isEditMode = !readonly;
    }
    var typeList = window.stdTypeList;
    var typeListNum = typeList.length;

    str += "<td id='td-param-dataType-" + id + "' class='td-param dataType'>";
    if (isEditMode) {
        str += "<select id='select-dataType-" + id + "' class='select-dataType' onkeypress='ws.dataTypeKeyPressed(event, " +
            id + ");' onchange='ws.customDataTypeSelectChanged(" + id + ", this.value);'>";
        for (var i = 0; i < typeListNum; i++) {
            var item = typeList[i];
            str += "<option value='" + item + "'" + (item == type ? " selected='true'" : "") + ">" + util.escaper.escapeInH(item) + "</option>";
        }
        for (var i = 0; i < cusTypeSelect.length; i++) {
            var item = cusTypeSelect[i];
            str += "<option data-type='custom' value='" + item + "'" + (item == type ? " selected='true'" : "") + ">" + util.escaper.escapeInH(item) + "</option>";
        }
        str += "</select>";
    } else {
        str += util.escaper.escapeInH(type);
    }
    str += "</td>";
    return str;
};

ws.customDataTypeSelectChanged = function (parameterId, value) {
    rap.project.setParameter(parameterId, value, "dataType");
    var isCustomJson = false;
    var cusData = [];
    for (var i = 0; i < cusTypeList.length; i++) {
        var item = cusTypeList[i];
        if (value === item.name) {
            isCustomJson = true;
            cusData = JSON.parse(item.data);
            break;
        }
    }
    var param = rap.project.getParameter(parameterId);
    if(isCustomJson){
        param.parameterList = cusData;
    } else {
        param.parameterList = [];
    }
    ws.customRenderAction();
};

ws.customDoImportJSON = function() {
    var ele = document.getElementById('importJSONFloater-text');
    var txt = ele.value;
    try {
        if (typeof JSON === 'undefined') {
            alert('您用的啥浏览器啊？连JSON转换都不支持也...请使用IE9+/Chrome/FF试试看？');
            return;
        }
        var data = eval("(" + txt + ")");

        if (data instanceof Array) {
            data = data[0];
        }

        ele.value = '';
        ws.customProcessJSONImport(data);
        ws.customRenderAction();
        ws.cancelImportJSON();
    } catch (e) {
        alert('JSON解析错误: ' + e.message);
    }
};

ws.customProcessJSONImport = function(f, k, pId, notFirst, arrContext) {
    var id, param;
    if (notFirst) {
        if (!pId) {//是否有插入的节点
            id = rap.project.addRequestParameter(ws.customAtionId);
            param = rap.project.getParameter(id);//获取当前插入点的参数
            param.identifier = k;//
        } else {
            id = rap.project.addChildParameter(pId);
            param = rap.project.getParameter(id);
            param.identifier = k;
        }
    }
    var key;
    var f2; // child of f
    var i;
    var mValues; // mock @order values
    if (f instanceof Array && f.length) {
        if (notFirst) {
            f2 = f[0];

            if (typeof f2 === 'string') {
                param.dataType = 'array<string>';
                param.remark = '@mock=' + f;
            } else if (typeof f2 === 'number') {
                param.dataType = 'array<number>';
                param.remark = '@mock=' + f;
            } else if (typeof f2 === 'boolean') {
                param.dataType = 'array<boolean>';
                param.remark = '@mock=' + f;
            } else if (f2 instanceof Array) {
                param.dataType = 'array';
                param.remark = '@mock=' + JSON.stringify(f);
            } else if (f !== null && typeof f2 === 'object') {
                param.dataType = 'array<object>';
                for (key in f2) {
                    ws.customProcessJSONImport(f2[key], key, notFirst ? id : undefined, true, f.length > 1 ? f : undefined);
                }
            }

            // process @order for import array data
            if (typeof f2 in {'number': undefined, 'boolean': undefined} && f.length > 1) {
                mValues = [f2];
                for (i = 1; i < f.length; i++) {
                    mValues.push(f[i]);
                }
                param.remark = '@mock=$order(' + mValues.join(',') + ')';
            } else if (typeof f2 === 'string' && f.length > 1) {
                mValues = ['\'' + f2 + '\''];
                for (i = 1; i < f.length; i++) {
                    mValues.push('\'' + f[i] + '\'');
                }
                param.remark = '@mock=$order(' + mValues.join(',') + ')';
            }

        }
    } else if (typeof f === 'string') {
        if (param) {
            param.dataType = 'string';
            param.remark = '@mock=' + f;
        }
    } else if (typeof f === 'number') {
        if (param) {
            param.dataType = 'number';
            param.remark = '@mock=' + f;
        }
    } else if (typeof f === 'boolean') {
        if (param) {
            param.dataType = 'boolean';
            param.remark = '@mock=' + f;
        }
    } else if (typeof f === 'undefined') {
    } else if (f === null) {
    } else if (typeof f === 'object') {
        var oldKey;
        var oldItem;

        param && (param.dataType = 'object');

        Object.keys(f).forEach(function (key) {
            oldKey = key;
            oldItem = f[key];
            if (f[key] && f[key] instanceof Array && f[key].length > 1
                && f[key][0] instanceof Object && f[key][0] !== null
                && !(f[key][0] instanceof Array)) {
                key = key + '|' + f[key].length;
                delete f[oldKey];
                f[key] = oldItem;
            }


            ws.customProcessJSONImport(f[key], key, notFirst ? id : null, true);

        });
    }

    if (arrContext && typeof f in {'number': undefined, 'boolean': undefined}) {
        // process @order for import array data for array<object>
        mValues = [f];
        for (i = 1; i < arrContext.length; i++) {
            mValues.push(arrContext[i][k]);
        }
        param.remark = '@mock=$order(' + mValues.join(',') + ')';
    } else if (arrContext && typeof f === 'string') {
        mValues = ['\'' + f + '\''];
        for (i = 1; i < arrContext.length; i++) {
            mValues.push('\'' + arrContext[i][k] + '\'');
        }
        param.remark = '@mock=$order(' + mValues.join(',') + ')';
    }
};

class JsonModule extends React.Component {

    _checkJsonString = (str) => {
        if (typeof str == 'string') {
            try {
                JSON.parse(str);
                return true;
            } catch (e) {
                console.log(e);
                return false;
            }
        }
    }

    constructor(props) {
        super(props);
        this.state = {
            jsonList: [],
            showAddJsonModal: false,
            showDeleteJsonModal: false,
            showUpdateJsonModal: false,
            addModalName: '',
            addModalDescribe: '',
            addModalAddition: '',
            addModalJsonStr: '',
            showJsonModal: false,
            showJsonData: '',
            selectJsonObj: '',
            productlineId: window.projectlineId,
            id: window.teamId,
        }
    }

    componentWillUnmount() {
        console.log('will unmount');
    }

    _showAddJsonModal = () => {
        this.setState({
            showAddJsonModal: !this.state.showAddJsonModal,
        });
    }

    _showDeleteJsonModal = (item, key) => {
        this.setState({
            showDeleteJsonModal: !this.state.showDeleteJsonModal,
        });
    }

    _showUpdateJsonModal = (item, key) => {
        this.setState({
            showUpdateJsonModal: !this.state.showUpdateJsonModal,
        });
    }

    componentWillMount() {
        this._requestAllJson();
    }

    _requestAllJson = () => {
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
                window.cusTypeList = response;
                window.cusTypeSelect = response.map(function(item) {
                    return item.name;
                });
            }).catch(err => {
            console.log(JSON.stringify(err, null, 4));
        })
    }

    _addJsonBtn = () => {
        let {addModalName, addModalDescribe, addModalAddition, addModalJsonStr} = this.state;

        if (addModalName === '') {
            alert('名称不能为空！')
            return;
        }

        addModalJsonStr = JSON.stringify(rap.project.getAction(ws.customAtionId).requestParameterList);

        fetch("/org/group/addCommonJson.do", {
            method: "POST",
            headers: {
                "Content-Type": "application/x-www-form-urlencoded"
            },
            body: `jsonName=${addModalName}&jsonData=${encodeURIComponent(addModalJsonStr)}&describe=${addModalDescribe}&addition=${addModalAddition}&id=${this.state.id}&productlineId=${this.state.productlineId}`
        }).then(response => response.json()).then(data => {
            if (data.code === 0) {
                this._requestAllJson();
            } else {
                alert(data.msg);
            }
            this._showAddJsonModal();
        });
    }

    _clickShowJsonModal = (item) => {
        this._showJsonModal();
        this.setState({showJsonData: item.item.data, showJsonModal: true});
    }

    _showJsonModal = () => {
        this.setState({showJsonModal: !this.state.showJsonModal});
    }

    _deleteJson = () => {
        const {selectJsonObj} = this.state;
        if (!selectJsonObj && !selectJsonObj.id) {
            alert('操作出错！')
            return;
        }

        fetch("/org/group/deleteCommonJson.do", {
            method: "POST",
            headers: {
                "Content-Type": "application/x-www-form-urlencoded"
            },
            body: `jsonId=${selectJsonObj.id}&id=${this.state.id}&productlineId=${this.state.productlineId}`
        }).then(response => response.json()).then(data => {
            if (data.code === 0) {
                this._requestAllJson();
            } else {
                alert(data.msg);
            }
            this._showDeleteJsonModal();
        });
    }

    _updateJsonBtn = () => {
        const {selectJsonObj} = this.state;

        let {name, id, data, describe, addition} = selectJsonObj;

        data = JSON.stringify(rap.project.getAction(ws.customAtionId).requestParameterList);

        if (name === '') {
            alert('名称不能为空！')
            return;
        }

        fetch("/org/group/updateCommonJson.do", {
            method: "POST",
            headers: {
                "Content-Type": "application/x-www-form-urlencoded"
            },
            body: `jsonName=${name}&jsonData=${encodeURIComponent(data)}&describe=${describe}&addition=${addition}&jsonId=${id}&id=${this.state.id}&productlineId=${this.state.productlineId}`
        }).then(response => response.json()).then(data => {
            if (data.code === 0) {
                this._requestAllJson();
            } else {
                alert(data.msg);
            }
            this._showUpdateJsonModal();
        });
    }

    _doAddA = () => {
        // generating action
        var action = {};
        action.pageId = rap.project.getData().moduleList[0].pageList[0].id;
        action.name = 'add-form';
        action.requestType = 1;
        action.requestUrl = 'url';
        action.responseTemplate = '';
        action.description = '';
        var struct = 'object';
        // update model
        var id = rap.project.addAction(action);
        ws.customAtionId = id;
        return id;
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

        const tableStart = '<table class=\"table-a\"><tr class=\"head\"><td class=\"head-expander\"></td><td class=\"head-identifier\">变量名</td><td class=\"head-name\">含义</td><td class=\"head-type\">类型</td><td class=\"head-remark\">备注</td></tr>';
        const tableEnd = '</table>';
        let renderTable = '';
        let tableBody = '';
        let actionTable = '';
        if (this.state.showJsonModal && this.state.showJsonData) {
            // let mapData = ws.processJSONImportMethod(JSON.parse(this.state.showJsonData), '', undefined, true, undefined, true);
            // tableBody = ws.getPTRHtml(mapData, 0, false);
            // if (tableBody.indexOf('</tr>')) { // remove the first tr
            //     tableBody = tableBody.slice(tableBody.indexOf('</tr>') + 5, tableBody.length);
            // }
            let actionId = this.actionId || this._doAddA();
            this.actionId = actionId;
            let action = rap.project.getAction(actionId);
            action.requestParameterList = JSON.parse(this.state.showJsonData);
            renderTable = ws.customGetAHtml(action, true);
        } else if (this.state.showAddJsonModal) {
            let actionId = this.actionId || this._doAddA();
            this.actionId = actionId;
            actionTable = ws.customGetAHtml(rap.project.getAction(actionId));
        } else if (this.state.showUpdateJsonModal  && this.state.selectJsonObj) {
            let actionId = this.actionId || this._doAddA();
            this.actionId = actionId;
            let action = rap.project.getAction(actionId);
            action.requestParameterList = JSON.parse(this.state.selectJsonObj.data);
            actionTable = ws.customGetAHtml(rap.project.getAction(actionId));
        } else {
            this.actionId && rap.project.removeAction(this.actionId);
            this.actionId = undefined;
            ws.customAtionId = undefined;
        }
        return (
            <div>
                <Panel header={<span style={{fontsize: 24}}>自定义数据类型</span>} style={{width: 1140, marginTop: 50}}>
                    <ButtonToolbar>
                        <Button
                            bsStyle="primary"
                            onClick={() => this._showAddJsonModal()}
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
                            this.state.jsonList.map((item, key) => {
                                return (
                                    <tr key={key}>
                                        <td style={styles.td}>{key}</td>
                                        <td style={styles.td}>{item.name}</td>
                                        <td style={styles.td}>{item.describe}</td>
                                        <td style={styles.td}>{item.addition}</td>
                                        <td style={styles.td}>
                                            <Button
                                                bsStyle="primary"
                                                onClick={() => this._clickShowJsonModal({item})}
                                            >
                                                点击查看
                                            </Button>
                                        </td>
                                        <td>
                                            <ButtonToolbar style={styles.td}>
                                                <Button
                                                    bsStyle="danger"
                                                    onClick={() => {
                                                        this._showDeleteJsonModal(item, key);
                                                        this.setState({selectJsonObj: item})
                                                    }}
                                                >
                                                    删除
                                                </Button>
                                                <Button
                                                    bsStyle="warning"
                                                    onClick={() => {
                                                        this._showUpdateJsonModal(item, key);
                                                        this.setState({selectJsonObj: item});
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
                                onChange={(e) => this.setState({addModalName: e.target.value})}
                                type="text"
                                placeholder="Enter text"
                            />
                            <ControlLabel>请输入说明</ControlLabel>
                            <FormControl
                                onChange={(e) => this.setState({addModalDescribe: e.target.value})}
                                type="text"
                                placeholder="Enter text"
                            />
                            <ControlLabel>请输入备注</ControlLabel>
                            <FormControl
                                onChange={(e) => this.setState({addModalAddition: e.target.value})}
                                type="text"
                                placeholder="Enter text"
                            />
                            <ControlLabel>请输入内容</ControlLabel>
                            <div id="add-form" style={{
                                width: 'initial', overflow: 'auto', float: 'initial'
                            }} className="div-a" dangerouslySetInnerHTML={{__html: actionTable}}></div>
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
                        <Button onClick={() => this._deleteJson()}>确定</Button>
                        <Button onClick={() => this._showDeleteJsonModal()} bsStyle="primary">取消</Button>
                    </Modal.Footer>
                </Modal>

                <Modal show={this.state.showJsonModal}>
                    <Modal.Header>
                        <Modal.Title>当前内容</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
        <pre style={{
            maxHeight: '600px'
        }}>
    <div style={{
        margin: '0px 18px 0px 0px',
        width: 'initial',
        'overflow-x': 'visible'
    }} className="div-a" dangerouslySetInnerHTML={{__html: renderTable}}></div>
        </pre>
                    </Modal.Body>
                    <Modal.Footer>
                        <Button onClick={() => this._showJsonModal()} bsStyle="primary">关闭</Button>
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
                                onChange={(e) => {
                                    let v = this.state.selectJsonObj;
                                    v.name = e.target.value;
                                    this.setState({selectJsonObj: v});
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
                                onChange={(e) => {
                                    let v = this.state.selectJsonObj;
                                    v.describe = e.target.value;
                                    this.setState({selectJsonObj: v});
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
                                onChange={(e) => {
                                    let v = this.state.selectJsonObj;
                                    v.addition = e.target.value;
                                    this.setState({selectJsonObj: v});
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
                            <div id="add-form" style={{
                                width: 'initial', overflow: 'auto', float: 'initial'
                            }} className="div-a" dangerouslySetInnerHTML={{__html: actionTable}}></div>
                        </FormGroup>
                    </Modal.Body>
                    <Modal.Footer>
                        <Button onClick={() => this._showUpdateJsonModal()}>取消</Button>
                        <Button onClick={() => this._updateJsonBtn()} bsStyle="primary">保存</Button>
                    </Modal.Footer>
                </Modal>
            </div>
        )
    }
}

ReactDOM.render(<JsonModule/>, document.getElementById('custom-section'));