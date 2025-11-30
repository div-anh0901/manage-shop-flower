import API from "../../../api/axios";

export const createFlower = async (productData) => {
    try {
        const response = await API.post('/flowers', productData);
        return response.data;
    } catch (error) {
        console.error('Error creating flower:', error);
        throw error;
    }
};

export const getAll = async () => {
    try {
        const response = await API.post('/flowers/getAll', productData);
        return response.data;
    } catch (error) {
        console.error('Error creating flower:', error);
        throw error;
    }
};


export const getOne = async (id) => {
    try {
        const response = await API.get('/flowers/' + id);
        return response.data;
    } catch (error) {
        console.error('Error creating flower:', error);
        throw error;
    }
};

export const update = async (id, productData) => {
    try {
        const response = await API.put('/flowers/' + id, productData);
        return response.data;
    } catch (error) {
        console.error('Error creating flower:', error);
        throw error;
    }
};

export const remove = async (id) =>{
    try {
        const response = await API.delete('/flowers/' + id);
        return response.data;
    } catch (error) {
        console.error('Error creating flower:', error);
        throw error;
    }
}

export const exportExcel = async (filter) => {
    try {
        await API.post('/flowers/exportExcel', {
            search: filter.txtSearch || "",
            filter: filter || {},
        },
        {
            responseType: 'blob'
        }).then(res => {
            const url = window.URL.createObjectURL(new Blob([res.data]));
            const a = document.createElement('a');
            a.href = url;
            a.download = 'flowers.xlsx';
            a.click();
        });
    } catch (error) {
        console.error('Error creating flower:', error);
        throw error;
    }
}

export const importExcelApi = async (formData) =>{
    try {
        delete API.defaults.headers["Content-Type"];
        const response = await API.post('/flowers/importExcel', formData);
        return response.data;
    } catch (error) {
        console.error('Error creating flower:', error);
        throw error;
    }
}

export const renderHistoryApi = async (productId) =>{
    try {
        const response = await API.post('/flowers-history', {
            productId
        });
        return response.data;
    } catch (error) {
        console.error('Error creating flower:', error);
        throw error;
    }
}