import React from 'react';
import { store } from '../../state/store';
import { useStore } from '../../state/storeHooks';
import { buildGenericFormField } from '../../types/genericFormField';
import { GenericForm } from '../GenericForm/GenericForm';
import { addTag, EditorState, removeTag, updateField } from './ArticleEditor.slice';

export function ArticleEditor({ onSubmit }: { onSubmit: (ev: React.FormEvent) => void }) {
  const { article, submitting, tag, errors } = useStore(({ editor }) => editor);

  return (
    <div className='editor-page'>
      <div className='container page'>
        <div className='row'>
          <div className='col-md-10 offset-md-1 col-xs-12'>
            <GenericForm
              formObject={{ ...article, tag } as unknown as Record<string, string | null>}
              disabled={submitting}
              errors={errors}
              onChange={onUpdateField}
              onSubmit={onSubmit}
              submitButtonText='Publish Article'
              onAddItemToList={onAddTag}
              onRemoveListItem={onRemoveTag}
              fields={[
                buildGenericFormField({ name: 'title', placeholder: 'Article Title' }),
                buildGenericFormField({ name: 'description', placeholder: "What's this article about?", lg: false }),
                buildGenericFormField({
                  name: 'body',
                  placeholder: 'Write your article (in markdown)',
                  fieldType: 'textarea',
                  rows: 8,
                  lg: false,
                }),
                buildGenericFormField({
                  name: 'tag',
                  placeholder: 'Enter Tags',
                  listName: 'tagList',
                  fieldType: 'list',
                  lg: false,
                }),
              ]}
            />
          </div>
        </div>
      </div>
    </div>
  );
}

function onUpdateField(name: string, value: string) {
  store.dispatch(updateField({ name: name as keyof EditorState['article'], value }));
}

function onAddTag() {
  store.dispatch(addTag());
}

function onRemoveTag(_: string, index: number) {
  store.dispatch(removeTag(index));
}
