import React, { useState } from 'react';
import { DataSource } from 'devextreme-react/common/data';
import DataGrid, { Column, Pager, Paging, FilterRow, Lookup, Button } from 'devextreme-react/data-grid';
import { Popup } from 'devextreme-react/popup';
import { Form, SimpleItem, Label } from 'devextreme-react/form';
import './orders.scss';

export function Orders() {
  // === Popup states ===
  const [isCreatePopupVisible, setCreatePopupVisible] = useState(false);
  const [isImportPopupVisible, setImportPopupVisible] = useState(false);
  const [isFilterPopupVisible, setFilterPopupVisible] = useState(false);

  // === Form data ===
  const [newOrder, setNewOrder] = useState({
    code: '',
    name: '',
    status: '',
    customer: '',
    phone: '',
    createdAt: new Date(),
    dueDate: new Date(),
  });

  const [filterData, setFilterData] = useState({
    name: '',
    status: '',
    startDate: null,
    endDate: null,
  });

  // === Handlers ===
  const handleCreate = () => setCreatePopupVisible(true);
  const handleImport = () => setImportPopupVisible(true);
  const handleFilter = () => setFilterPopupVisible(true);
  const handleExport = () => console.log('⬇ Export button clicked!');

  const handleSaveOrder = () => {
    console.log('✅ Order created:', newOrder);
    setCreatePopupVisible(false);
  };

  const handleImportFile = (e) => {
    const file = e.target.files[0];
    if (file) {
      console.log('📂 Import file selected:', file.name);
      setImportPopupVisible(false);
    }
  };

  const handleApplyFilter = () => {
    console.log('🔍 Filter applied:', filterData);
    setFilterPopupVisible(false);
  };


  // state quản lý sản phẩm
  const [orderProducts, setOrderProducts] = useState([]);
  const [totalCost, setTotalCost] = useState(0);
  const [totalPrice, setTotalPrice] = useState(0);

  const handleAddProduct = () => {
    setOrderProducts([
      ...orderProducts,
      { id: Date.now(), code: '', name: '', quantity: 1, cost: 0, price: 0 }
    ]);
  };

  const handleRemoveProduct = (id) => {
    setOrderProducts(orderProducts.filter(p => p.id !== id));
    handleUpdateTotals();
  };

  const handleUpdateTotals = () => {
    const costSum = orderProducts.reduce((acc, p) => acc + (p.cost * p.quantity), 0);
    const priceSum = orderProducts.reduce((acc, p) => acc + (p.price * p.quantity), 0);
    setTotalCost(costSum);
    setTotalPrice(priceSum);
  };


  return (
    <React.Fragment>
      <div className="flower-header">
        <h2>Đơn hàng</h2>
        <div className="actions">
          <button className="btn btn-create" onClick={handleCreate}>+ Thêm mới</button>
          <button className="btn btn-export" onClick={handleExport}>⬇ Export</button>
          <button className="btn btn-import" onClick={handleImport}>⬆ Import</button>
          <button className="btn btn-filter" onClick={handleFilter}>🔍 Filter</button>
        </div>
      </div>

      {/* === Data Grid === */}
      <DataGrid
        className={'dx-card content-block'}
        dataSource={dataSource}
        showBorders={false}
        focusedRowEnabled={true}
        columnAutoWidth={true}
        columnHidingEnabled={true}
      >
        <Paging defaultPageSize={10} />
        <Pager showPageSizeSelector={true} showInfo={true} />
        {/*<FilterRow visible={true} />*/}

        <Column dataField={'Task_ID'} caption='STT' width={90} />
        <Column dataField={'Task_Subject'} caption={'Mã đơn hàng'} width={190} />
        <Column dataField={'Task_Status'} caption={'Tên đơn hàng'} />
        <Column dataField={'Task_Priority'} caption={'Trạng thái'}>
          <Lookup dataSource={priorities} valueExpr={'value'} displayExpr={'name'} />
        </Column>
        <Column dataField={'Task_Start_Date'} caption={'Ngày tạo'} dataType={'date'} />
        <Column dataField={'Task_Due_Date'} caption={'Ngày giao'} dataType={'date'} />
        <Column dataField={'Task_Priority'} caption={'Khách hàng'} />
        <Column dataField={'Task_Completion'} caption={'Số điện thoại'} />
      </DataGrid>
       {/* === Popup: Thêm mới === */}
       <Popup
          visible={isCreatePopupVisible}
          onHiding={() => setCreatePopupVisible(false)}
          showTitle={true}
          title="Thêm mới đơn hàng"
          width="100%"
          height="100%"
          fullScreen={true}  // 🔥 DevExtreme hỗ trợ trực tiếp fullScreen mode
          dragEnabled={false}
          closeOnOutsideClick={false}
        >
          <div className="order-form-fullscreen">
            {/* Nội dung form thêm mới giữ nguyên */}
            <Form
              formData={newOrder}
              labelLocation="top"
              colCount={2}
              onFieldDataChanged={(e) =>
                setNewOrder({ ...newOrder, [e.dataField]: e.value })
              }
            >
              {/* =============================
              THÔNG TIN CHUNG KHÁCH HÀNG
              ============================== */}
              <h4 className="form-section-title">Thông tin chung khách hàng</h4>
              <div className="form-row">
                <div className="form-item">
                  <SimpleItem dataField="code" editorType="dxTextBox">
                    <Label text="Mã đơn hàng" />
                  </SimpleItem>
                </div>
                <div className="form-item">
                  <SimpleItem dataField="name" editorType="dxTextBox">
                    <Label text="Tên đơn hàng" />
                  </SimpleItem>
                </div>
                <div className="form-item">
                  <SimpleItem dataField="email" editorType="dxTextBox">
                    <Label text="Email" />
                  </SimpleItem>
                </div>
              </div>

              <div className="form-row">
                <SimpleItem dataField="address" editorType="dxTextBox">
                  <Label text="Địa chỉ giao hàng" />
                </SimpleItem>
                <SimpleItem dataField="phone" editorType="dxTextBox">
                  <Label text="Số điện thoại KH" />
                </SimpleItem>
                <SimpleItem dataField="phone" editorType="dxTextBox">
                  <Label text="Số điện thoại người nhận hàng" />
                </SimpleItem>
              </div>

              <div className="form-row">
                <SimpleItem
                  dataField="status_payment"
                  editorType="dxSelectBox"
                  editorOptions={{ items: ['Chuyển khoản', 'Tiền mặt'] }}
                >
                  <Label text="Phương thức thanh toán" />
                </SimpleItem>

                <SimpleItem
                  dataField="status"
                  editorType="dxSelectBox"
                  editorOptions={{ items: ['Đang xử lý', 'Hoàn tất', 'Đã hủy'] }}
                >
                  <Label text="Trạng thái" />
                </SimpleItem>

                <SimpleItem dataField="createdAt" editorType="dxDateBox">
                  <Label text="Ngày tạo" />
                </SimpleItem>
              </div>

              <div className="form-row">
                <SimpleItem dataField="dueDate" editorType="dxDateBox">
                  <Label text="Ngày nhận hàng" />
                </SimpleItem>
                <SimpleItem dataField="hourOrder" editorType="dxTextBox">
                  <Label text="Giờ nhận hàng" />
                </SimpleItem>
                <SimpleItem dataField="description" editorType="dxTextBox">
                  <Label text="Mô tả thêm" />
                </SimpleItem>
              </div>
            </Form>
            <hr />

            {/* =============================
                  BẢNG SẢN PHẨM TRONG ĐƠN HÀNG
            ============================== */}
            <div className="product-section">
              <div className="product-header">
                <h4>Danh sách sản phẩm</h4>
                <button className="btn btn-add-product" onClick={handleAddProduct}>
                  + Thêm sản phẩm
                </button>
              </div>

              <DataGrid
                dataSource={orderProducts}
                keyExpr="id"
                showBorders={true}
                columnAutoWidth={true}
                onRowRemoved={(e) => handleRemoveProduct(e.data.id)}
                editing={{ allowDeleting: true, mode: 'row' }}
              >
                <Column dataField="code" caption="Mã sản phẩm" />
                <Column dataField="name" caption="Tên sản phẩm" />
                <Column
                  dataField="quantity"
                  caption="Số lượng"
                  dataType="number"
                  editorType="dxNumberBox"
                  width={100}
                  onValueChanged={(e) => handleUpdateTotals()}
                />
                <Column
                  dataField="cost"
                  caption="Giá vốn"
                  dataType="number"
                  width={120}
                  onValueChanged={(e) => handleUpdateTotals()}
                />
                <Column
                  dataField="price"
                  caption="Giá bán"
                  dataType="number"
                  width={120}
                  onValueChanged={(e) => handleUpdateTotals()}
                />
                <Column
                  caption="Thành tiền"
                  calculateCellValue={(data) => data.quantity * data.price}
                  width={130}
                />
                <Column type="buttons" caption="Hành động" width={100}>
                  <Button name="delete" />
                </Column>
              </DataGrid>
            </div>

            <div className="popup-actions">
              <button className="btn btn-cancel" onClick={() => setCreatePopupVisible(false)}>
                Hủy
              </button>
              <button className="btn btn-save" onClick={handleSaveOrder}>
                Lưu
              </button>
            </div>
          </div>
        </Popup>
      {/* === Popup: Import === */}
      <Popup
        visible={isImportPopupVisible}
        onHiding={() => setImportPopupVisible(false)}
        showTitle={true}
        title="Import dữ liệu"
        width={400}
        height={200}
      >
        <div className="import-content">
          <p>Chọn tệp Excel (.xlsx) để import dữ liệu đơn hàng:</p>
          <input type="file" accept=".xlsx,.xls" onChange={handleImportFile} />
          <div className="popup-actions">
            <button className="btn btn-cancel" onClick={() => setImportPopupVisible(false)}>Hủy</button>
          </div>
        </div>
      </Popup>

      {/* === Popup: Filter === */}
      <Popup
        visible={isFilterPopupVisible}
        onHiding={() => setFilterPopupVisible(false)}
        showTitle={true}
        title="Lọc đơn hàng"
        width={450}
      >
        <Form formData={filterData} onFieldDataChanged={(e) => setFilterData({ ...filterData, [e.dataField]: e.value })}>
          <SimpleItem dataField="name" editorType="dxTextBox"><Label text="Tên đơn hàng" /></SimpleItem>
          <SimpleItem dataField="status" editorType="dxSelectBox" editorOptions={{ items: ['Đang xử lý', 'Hoàn tất', 'Đã hủy'] }}><Label text="Trạng thái" /></SimpleItem>
          <SimpleItem dataField="startDate" editorType="dxDateBox"><Label text="Từ ngày" /></SimpleItem>
          <SimpleItem dataField="endDate" editorType="dxDateBox"><Label text="Đến ngày" /></SimpleItem>
        </Form>

        <div className="popup-actions">
          <button className="btn btn-cancel" onClick={() => setFilterPopupVisible(false)}>Hủy</button>
          <button className="btn btn-save" onClick={handleApplyFilter}>Lọc</button>
        </div>
      </Popup>
    </React.Fragment>
  );
}

const dataSource = new DataSource({
  store: {
    version: 2,
    type: 'odata',
    key: 'Task_ID',
    url: 'https://js.devexpress.com/Demos/DevAV/odata/Tasks'
  },
  expand: 'ResponsibleEmployee',
  select: [
    'Task_ID',
    'Task_Subject',
    'Task_Start_Date',
    'Task_Due_Date',
    'Task_Status',
    'Task_Priority',
    'Task_Completion',
    'ResponsibleEmployee/Employee_Full_Name'
  ]
});

const priorities = [
  { name: 'High', value: 4 },
  { name: 'Urgent', value: 3 },
  { name: 'Normal', value: 2 },
  { name: 'Low', value: 1 }
];
