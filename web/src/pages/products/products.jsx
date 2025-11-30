import React, { useEffect, useRef, useState } from 'react';
import CustomStore from "devextreme/data/custom_store";
import DataSource from "devextreme/data/data_source";
import DataGrid, {
  Column,
  Pager,
  Paging
} from 'devextreme-react/data-grid';
import { Form, SimpleItem, Label } from 'devextreme-react/form';
import './products.scss';
import { Popup } from 'devextreme-react/popup';
import ActionsCell from '../../components/actions/actions';
import { TabPanel, Item as TabItem } from "devextreme-react/tab-panel";
import {toast} from 'react-toastify';
import { createFlower, getOne, update, remove, exportExcel, importExcelApi, renderHistoryApi } from './api';
import API from '../../api/axios';
import ImportPopup from './components/import-popup';
import { templateImport } from './contant';
import { formatDate, formatNumber } from 'devextreme/localization';
import { formatDateYYYYMMDD } from '../../utils';


export function Product() {
  const [isCreatePopupVisible, setCreatePopupVisible] = useState(false);
  const [isImportPopupVisible, setImportPopupVisible] = useState(false);
  const [isFilterPopupVisible, setFilterPopupVisible] = useState(false);
  const [isViewPopupVisible, setViewPopupVisible] = useState(false);
  const [historyList, setHistoryList] = useState([]);
  const [isDeletePopupVisible, setDeletePopupVisible] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);
  const [filterData, setFilterData] = useState({
    txtSearch: '',
    status: '',
    startDate: null,
    endDate: null,
  });
  const [ds, setDs] = useState(flowerDataSource({}));
  const [appliedFilter, setAppliedFilter] = useState({}); 
  const [newProduct, setNewProduct] = useState({
    _id: '',
    code: '',
    name: '',
    category: '',
    basePrice: 0,
    currentPrice: 0,
    status: 'Active',
    description: ''
  });

  const handleCreate = () => setCreatePopupVisible(true);
  const handleImport = () => setImportPopupVisible(true);
  const handleFilter = () => setFilterPopupVisible(true);
 
  const handleView = async (id) => {
    const rs = await getOne(id);
    setNewProduct(rs.data);
    const resHistory = await renderHistoryApi(id);
    setHistoryList(resHistory.data);
    setViewPopupVisible(true);
  }

  useEffect(() => {
    setDs(flowerDataSource(appliedFilter));   // reload datasource khi bấm nút Lọc
    
  }, [appliedFilter]);


  const handleExport = () => {
    exportExcel(filterData)
  };

  const handleSaveProduct = async () => {
    if (!newProduct.name) return toast.error('Tên sản phẩm không được để trống', { position: 'top-center' });
    if (!newProduct.code) return toast.error('Mã sản phẩm không được để trống', { position: 'top-center' });
    if (!newProduct.basePrice || newProduct.basePrice <= 0) return toast.error('Giá vốn phải lớn hơn 0', { position: 'top-center' });
    if (!newProduct.currentPrice || newProduct.currentPrice <= 0) return toast.error('Giá bán phải lớn hơn 0', { position: 'top-center' });
    const newData = { ...newProduct };
    delete newData._id;
    await createFlower(newData).then((data) => {
      setNewProduct({
        _id: '',
        code: '',
        name: '',
        category: '',
        basePrice: 0,
        currentPrice: 0,
        status: 'Active',
        description: ''
      });
      setCreatePopupVisible(false);
      ds.reload()
      return toast.success('Tạo bản ghi thành công', { position: 'top-center' });
    }).catch((err) => {
      setCreatePopupVisible(false);
      ds.reload();
      return toast.error(err.response.data.message, { position: 'top-center' });
    });
  };

  const handleEditProduct = async () => {
    if(newProduct._id === ''){
      return;
    }
    if (!newProduct.name) return toast.error('Tên sản phẩm không được để trống', { position: 'top-center' });
    if (!newProduct.code) return toast.error('Mã sản phẩm không được để trống', { position: 'top-center' });
    if (!newProduct.basePrice || newProduct.basePrice <= 0) return toast.error('Giá vốn phải lớn hơn 0', { position: 'top-center' });
    if (!newProduct.currentPrice || newProduct.currentPrice <= 0) return toast.error('Giá bán phải lớn hơn 0', { position: 'top-center' });
    await update(newProduct._id, newProduct).then(data => {
      setNewProduct({
        _id: '',
        code: '',
        name: '',
        category: '',
        basePrice: 0,
        currentPrice: 0,
        status: 'Active',
        description: ''
      });
      setViewPopupVisible(false);
      ds.reload()
      return toast.success('Sửu bản ghi thành công', { position: 'top-center' });
    }).catch((err) => {
      setViewPopupVisible(false);
      ds.reload()
      return toast.error(err.response.data.message, { position: 'top-center' });
    })
  }

  const handleDeleteProduct = async (id) => {
    if(newProduct._id === ''){
      await remove(id).then((data) =>{
        setDeletePopupVisible(false)
        ds.reload()
        return toast.success('Xoá bản ghi thành công', { position: 'top-center' });
      }).catch(err => {
        setDeletePopupVisible(false)
        ds.reload()
        return toast.error(err.response.data.message, { position: 'top-center' });
      });
      return;
    }
    else {
      await remove(newProduct._id).then((data) =>{
        setViewPopupVisible(false);
        ds.reload()
        return toast.success('Xoá bản ghi thành công', { position: 'top-center' });
      }).catch(err => {
        setViewPopupVisible(false);
        ds.reload()
        return toast.error(err.response.data.message, { position: 'top-center' });
      });
    }
  }
    
  const handleImportFile = async (file) => {
    try {
      const formData = new FormData();
      formData.append("file", file);
      // Gọi API upload file
      await importExcelApi(formData);

      toast.success("Import thành công!");
      setImportPopupVisible(false);
      // reload dữ liệu nếu cần
    } catch (err) {
      console.error(err);
      toast.error("Import thất bại!");
    }
  };

  const handleApplyFilter = () => {
    setAppliedFilter({ ...filterData }); // áp dụng filter
    setFilterPopupVisible(false);
  };

  return (
    <React.Fragment>
      <div className="flower-header">
        <h2>Products</h2>
        <div className="actions">
          <button className="btn btn-create" onClick={handleCreate}>+ Thêm mới</button>
          <button className="btn btn-export" onClick={handleExport}>Export</button>
          <button className="btn btn-import" onClick={handleImport}>Import</button>
          <button className="btn btn-filter" onClick={handleFilter}>Filter</button>
        </div>
      </div>

      <DataGrid
        className={'dx-card content-block'}
        dataSource={ds}
        showBorders={false}
        focusedRowEnabled={true}
        columnAutoWidth={true}
        columnHidingEnabled={true}
      >
        <Paging defaultPageSize={10} />
        <Pager showPageSizeSelector showInfo />

        <Column dataField="name" caption="Name" />
        <Column dataField="code" caption="Code" />
        <Column dataField="category" caption="Category" />
        <Column dataField="basePrice" caption="Base Price" />
        <Column dataField="currentPrice" caption="Current Price" />
        <Column dataField="status" caption="Status" />
        <Column
          caption="Actions"
          width={150}
          cellRender={({ data }) => <ActionsCell 
            data={data}
            handleView={() => handleView(data._id)} 
            onDelete={() => {
              setSelectedItem(data)
              setDeletePopupVisible(true);
            }} 
          />}
        />
      </DataGrid>
      {/* === Popup: Thêm mới === */}
      <Popup
        visible={isCreatePopupVisible}
        onHiding={() => setCreatePopupVisible(false)}
        showTitle
        title="Thêm mới sản phẩm"
        width="50%"
        height="100%"
        dragEnabled={false}
        closeOnOutsideClick={false}
      >
        <div className="popup-container">
          <Form
            formData={newProduct}
            labelLocation="top"
            colCount={1}
            onFieldDataChanged={(e) =>
              setNewProduct({ ...newProduct, [e.dataField]: e.value })
            }
          >
            <h4 className="form-section-title">Thông tin chung sản phẩm</h4>
            <SimpleItem dataField="code" editorType="dxTextBox">
              <Label text="Mã sản phẩm" />
            </SimpleItem>
            <SimpleItem dataField="name" editorType="dxTextBox">
              <Label text="Tên sản phẩm" />
            </SimpleItem>
            <SimpleItem dataField="category" editorType="dxTextBox">
              <Label text="Danh mục" />
            </SimpleItem>
            <SimpleItem dataField="basePrice" editorType="dxNumberBox" editorOptions={{
              format: '#,##0',
              onValueChanged: (e) => setNewProduct({ ...newProduct, basePrice: e.value })
              }}>
              <Label text="Giá vốn" />
            </SimpleItem>
            <SimpleItem dataField="currentPrice" editorType="dxNumberBox" editorOptions={{
              format: '#,##0',
              onValueChanged: (e) => setNewProduct({ ...newProduct, currentPrice: e.value })
              }}>
              <Label text="Giá bán" />
            </SimpleItem>
            <SimpleItem
              dataField="status"
              editorType="dxSelectBox"
              editorOptions={{ items: ['Active', 'Lock'] }}
            >
              <Label text="Trạng thái" />
            </SimpleItem>
            <SimpleItem dataField="description" editorType="dxTextBox">
              <Label text="Mô tả thêm" />
            </SimpleItem>
          </Form>
          <div className="popup-actions">
              <button className="btn btn-cancel" onClick={() => setCreatePopupVisible(false)}>
                Hủy
              </button>
              <button className="btn btn-save" onClick={handleSaveProduct}>
                Lưu
              </button>
            </div>
          </div>
      </Popup>
      {/* === Popup: View === */}
      <Popup
        visible={isViewPopupVisible}
        onHiding={() => setViewPopupVisible(false)}
        showTitle
        title="Chi tiết sản phẩm"
        width="50%"
        height="100%"
        dragEnabled={false}
        closeOnOutsideClick={false}
      >
        <div className="popup-container">
          <TabPanel>
            {/* TAB 1: SỬA SẢN PHẨM */}
            <TabItem title="Sửa sản phẩm">
              <Form
                formData={newProduct}
                labelLocation="top"
                colCount={1}
                onFieldDataChanged={(e) =>
                  setNewProduct({ ...newProduct, [e.dataField]: e.value })
                }
              >
                <h4 className="form-section-title">Thông tin chung sản phẩm</h4>

                <SimpleItem dataField="code" editorType="dxTextBox">
                  <Label text="Mã sản phẩm" />
                </SimpleItem>

                <SimpleItem dataField="name" editorType="dxTextBox">
                  <Label text="Tên sản phẩm" />
                </SimpleItem>

                <SimpleItem dataField="category" editorType="dxTextBox">
                  <Label text="Danh mục" />
                </SimpleItem>

                <SimpleItem dataField="basePrice" editorType="dxNumberBox" editorOptions={{
                  format: '#,##0',
                  onValueChanged: (e) => setNewProduct({ ...newProduct, basePrice: e.value })
                }}>
                  <Label text="Giá vốn" />
                </SimpleItem>

                <SimpleItem dataField="currentPrice" editorType="dxNumberBox" editorOptions={{
                  format: '#,##0',
                  onValueChanged: (e) => setNewProduct({ ...newProduct, currentPrice: e.value })
                }}>
                  <Label text="Giá bán" />
                </SimpleItem>

                <SimpleItem
                  dataField="status"
                  editorType="dxSelectBox"
                  editorOptions={{ items: ["Active", "Lock"]}}
                >
                  <Label text="Active" />
                </SimpleItem>

                <SimpleItem dataField="description" editorType="dxTextBox">
                  <Label text="Mô tả thêm" />
                </SimpleItem>
              </Form>

              <div className="popup-actions">
                <button className="btn btn-cancel" onClick={() => setViewPopupVisible(false)}>
                  Hủy
                </button>
                <button className="btn btn-save" onClick={handleEditProduct}>
                  Lưu
                </button>
                <button className="btn btn-delete" onClick={handleEditProduct}>
                  Xoá
                </button>
              </div>
            </TabItem>

            {/* TAB 2: LỊCH SỬ */}
            <TabItem title="Lịch sử thay đổi">
              <div className="history-tab">
                {
                  historyList.map((item) => (
                    <div>
                        <p>Thay đổi ngày {formatDateYYYYMMDD(item.createdAt)}</p>
                       <DataGrid dataSource={item.changes} showBorders={true}>
                        <Column
                          dataField="field"
                          caption="Field"
                          width={150}
                        />

                        <Column
                          caption="Old Value"
                          cellRender={({ data }) => renderValue(data.oldValue)}
                        />

                        <Column
                          caption="New Value"
                          cellRender={({ data }) => renderValue(data.newValue)}
                        />
                      </DataGrid>
                    </div>
                  ))
                }
                {/* Bạn có thể đổi thành DataGrid nếu có history thật */}
                
              </div>
            </TabItem>
          </TabPanel>
        </div>
      </Popup>
      <Popup
        visible={isDeletePopupVisible}
        onHiding={() => setDeletePopupVisible(false)}
        showTitle
        title="Xác nhận xoá"
        width="400px"
        height="auto"
        dragEnabled={false}
        closeOnOutsideClick={false}
      >
        <div className="delete-confirm">
          <p>Bạn có chắc muốn xoá sản phẩm này?</p>
          <p><strong>{selectedItem?.name}</strong></p>
          <div className="popup-actions">
            <button
              className="btn btn-cancel"
              onClick={() => 
                setDeletePopupVisible(false)}
            >
              Hủy
            </button>

            <button
              className="btn btn-delete"
              onClick={() => {
                handleDeleteProduct(selectedItem?._id.toString())
              }}
            >
              Xoá
            </button>
          </div>
        </div>
      </Popup>
      {/* === Popup: Filter === */}
      <Popup
        visible={isFilterPopupVisible}
        onHiding={() => setFilterPopupVisible(false)}
        showTitle={true}
        title="Lọc sản phẩm"
        width={450}
      >
        <Form formData={filterData} onFieldDataChanged={(e) => setFilterData({ ...filterData, [e.dataField]: e.value })}>
          <SimpleItem dataField="txtSearch" editorType="dxTextBox"><Label text="Tên hoặc mã sản phẩn" /></SimpleItem>
          <SimpleItem dataField="status" editorType="dxSelectBox" editorOptions={{ items: ['Active', 'Lock'] }}><Label text="Trạng thái" /></SimpleItem>
        </Form>
        <div className="popup-actions">
          <button className="btn btn-cancel" onClick={() => setFilterPopupVisible(false)}>Hủy</button>
          <button className="btn btn-save" onClick={handleApplyFilter}>Lọc</button>
        </div>
      </Popup>
      <ImportPopup 
        visible={isImportPopupVisible}      
        onHiding={() => setImportPopupVisible(false)}
        handleImportFile={handleImportFile}
        templateUrl={templateImport}
        />
    </React.Fragment>
)}


export const flowerDataSource = (appliedFilter) =>
  new DataSource({
    store: new CustomStore({
      key: "_id",
      load: async (loadOptions) => {
        const response = await API.post("/flowers/getAll", {
          search: appliedFilter.txtSearch || "",
          filter: appliedFilter || {},
          skip: loadOptions.skip || 0,
          limit: loadOptions.take || 10,
        });
        return {
          data: response.data?.data?.data ?? [],
          totalCount: response.data?.data?.pagination?.totalItems ?? 0
        }
      },
    }),
    paginate: true,
    pageSize: 10,
    remoteOperations: { paging: true }, 
  });


  const renderValue = (value) => {
    if (value === null || value === undefined) return "-";
  
    // ObjectId
    if (typeof value === "string" && /^[a-fA-F0-9]{24}$/.test(value)) {
      return <span>{value}</span>;
    }
  
    // Date
    if (typeof value === "string" && value.endsWith("Z")) {
      return <span>{formatDate(value)}</span>;
    }
  
    // Number
    if (typeof value === "number") {
      return <span>{formatNumber(value)}</span>;
    }
  
    // Array
    if (Array.isArray(value)) {
      return <span>{value.length} items</span>;
    }
  
    // Default
    return <span>{value}</span>;
  };