import provinces from "./phProvinces.js";

const getProvinces = () => {
    let provinceList = [];
    for (let province in provinces) {
        provinceList = [...provinceList, province];
    }
    return provinceList.sort();
};

const getCitiesFromProvince = (province) => {
    let cities = [];

    for (let city in provinces[province].municipality_list) {
        cities = [...cities, city];
    }

    return cities.sort();
};

const getBarangaysFromCity = (province, city) => {
    if (provinces[province].municipality_list[city]) {
        return provinces[province].municipality_list[city].barangay_list
            .map((barangay) => ({ value: barangay, label: barangay }))
            .sort();
    }

    return [];
};

const phProvinces = {
    getProvinces: getProvinces,
    getCitiesFromProvince: getCitiesFromProvince,
    getBarangaysFromCity: getBarangaysFromCity,
};

export default phProvinces;
