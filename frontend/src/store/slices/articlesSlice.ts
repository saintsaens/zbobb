import { createSlice, createAsyncThunk, type PayloadAction } from '@reduxjs/toolkit';
import type { Article } from '../../components/LinksManager';
import type { SelectedPosition } from '../../hooks/useArrowNavigation';

export const fetchArticles = createAsyncThunk<Article[]>('articles/fetch', async () => {
    const res = await fetch('http://localhost:3000/api/articles/');
    if (!res.ok) throw new Error('Failed to fetch articles');
    return (await res.json()) as Article[];
});

type ArticlesState = {
    items: Article[];
    loading: boolean;
    error: string | null;
    editingLink: SelectedPosition | null;
};

const initialState: ArticlesState = {
    items: [],
    loading: false,
    error: null,
    editingLink: null,
};

const articlesSlice = createSlice({
    name: 'articles',
    initialState,
    reducers: {
        updateLink: (
            state,
            action: PayloadAction<{
                articleId: number;
                linkIndex: number;
                newHref: string;
            }>
        ) => {
            const { articleId, linkIndex, newHref } = action.payload;
            const article = state.items.find((a) => a.id === articleId);
            if (article) {
                article.links[linkIndex].href = newHref;
            }
        },
        startEdit: (state, action: PayloadAction<SelectedPosition>) => {
            state.editingLink = action.payload;
        },
        cancelEdit: (state) => {
            state.editingLink = null;
        },
        saveEdit: (
            state,
            action: PayloadAction<{ sectionIndex: number; linkIndex: number; newHref: string }>
        ) => {
            const { sectionIndex, linkIndex, newHref } = action.payload;
            const article = state.items[sectionIndex];
            if (article) {
                article.links[linkIndex].href = newHref;
            }
            state.editingLink = null;
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchArticles.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchArticles.fulfilled, (state, action) => {
                state.items = action.payload;
                state.loading = false;
            })
            .addCase(fetchArticles.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message || 'Unknown error';
            });
    },
});

export const { updateLink, startEdit, cancelEdit, saveEdit } = articlesSlice.actions;
export default articlesSlice.reducer;
