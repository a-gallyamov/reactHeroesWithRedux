import { createAsyncThunk, createEntityAdapter, createSlice } from "@reduxjs/toolkit";
import { useHttp } from "../../hooks/http.hook";

const filterAdapter = createEntityAdapter();

export const fetchFilters = createAsyncThunk(
    'filters/fetchFilters',
    async () => {
        const {request} = useHttp();
        return await request('http://localhost:3001/filters');
    }
)

export const filtersSlice = createSlice({
    name: 'filters',
    initialState: filterAdapter.getInitialState({
        filtersLoadingStatus: 'idle',
        activeFilter: 'all',
    }),
    reducers: {
        activeFilterChanged: (state, action) => {
            state.activeFilter = action.payload;
        }
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchFilters.pending, (state) => {
                state.filtersLoadingStatus = 'loading';
            })
            .addCase(fetchFilters.fulfilled, (state, action) => {
                state.filtersLoadingStatus = 'idle';
                filterAdapter.setAll(state, action.payload);
            })
            .addCase(fetchFilters.rejected, (state) => {
                state.filtersLoadingStatus = 'error';
            });
    }
});

const { actions, reducer } = filtersSlice;

export const { selectAll } = filterAdapter.getSelectors((state) => state.filters);

export default reducer;
export const {
    filtersFetching,
    filtersFetched,
    filtersFetchingError,
    activeFilterChanged
} = actions;
