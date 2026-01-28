import {
  fetchMasterListApi,
  createMasterApi,
  updateMasterApi,
  deleteMasterApi,
  MASTER_PATHS
} from "@/lib/api/master.api";

useEffect(() => {
  fetchMasterListApi(MASTER_PATHS.EVENT_TYPE)
    .then(res => setData(res.data));
}, []);

const createEventType = (payload) => {
  createMasterApi(MASTER_PATHS.EVENT_TYPE, payload);
};

const updateEventType = (id, payload) => {
  updateMasterApi(MASTER_PATHS.EVENT_TYPE, id, payload);
};

const deleteEventType = (id) => {
  deleteMasterApi(MASTER_PATHS.EVENT_TYPE, id);
};
