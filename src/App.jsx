/* eslint-disable jsx-a11y/accessible-emoji */
import React, { useState } from 'react';
import './App.scss';

import classNames from 'classnames';
import usersFromServer from './api/users';
import categoriesFromServer from './api/categories';
import productsFromServer from './api/products';

const products = productsFromServer.map(product => {
  const findCategory =
    categoriesFromServer.find(category => category.id === product.categoryId) ||
    null;
  const findUser =
    findCategory !== null
      ? usersFromServer.find(user => user.id === findCategory.ownerId) || null
      : null;

  return { ...product, findCategory, findUser };
});

function getPreparedProducts(
  allProducts,
  { activeUser, activeCategory, query },
) {
  let preparedProducts = [...allProducts];

  if (activeUser !== 'all') {
    preparedProducts = preparedProducts.filter(
      product => product.findUser.name === activeUser,
    );
  }

  if (activeCategory !== 'all') {
    preparedProducts = preparedProducts.filter(
      product => product.findCategory.title === activeCategory,
    );
  }

  if (query) {
    preparedProducts = preparedProducts.filter(product => {
      return product.name.toLowerCase().includes(query.toLowerCase());
    });
  }

  return preparedProducts;
}

export const App = () => {
  const [activeUser, setActiveUser] = useState('all');
  const [activeCategory, setActiveCategory] = useState('all');
  const [query, setQuery] = useState('');

  const visibleProducts = getPreparedProducts(products, {
    activeUser,
    activeCategory,
    query,
  });

  return (
    <div className="section">
      <div className="container">
        <h1 className="title">Product Categories</h1>

        <div className="block">
          <nav className="panel">
            <p className="panel-heading">Filters</p>

            <p className="panel-tabs has-text-weight-bold">
              <a
                data-cy="FilterAllUsers"
                href="#/"
                onClick={() => setActiveUser('all')}
                className={classNames({
                  'is-active': activeUser === 'all',
                })}
              >
                All
              </a>

              {usersFromServer.map(user => (
                <a
                  key={user.id}
                  data-cy="FilterUser"
                  href="#/"
                  className={classNames({
                    'is-active': activeUser === user.name,
                  })}
                  onClick={() => setActiveUser(user.name)}
                >
                  {user.name}
                </a>
              ))}
            </p>

            <div className="panel-block">
              <p className="control has-icons-left has-icons-right">
                <input
                  data-cy="SearchField"
                  type="text"
                  className="input"
                  placeholder="Search"
                  value={query}
                  onChange={event => setQuery(event.target.value)}
                />

                <span className="icon is-left">
                  <i className="fas fa-search" aria-hidden="true" />
                </span>

                <span className="icon is-right">
                  {/* eslint-disable-next-line jsx-a11y/control-has-associated-label */}
                  {query !== '' ? (
                    <button
                      data-cy="ClearButton"
                      type="button"
                      className="delete"
                      onClick={() => setQuery('')}
                    />
                  ) : (
                    ''
                  )}
                </span>
              </p>
            </div>

            <div className="panel-block is-flex-wrap-wrap">
              <a
                href="#/"
                data-cy="AllCategories"
                onClick={() => setActiveCategory('all')}
                className={classNames('button', 'mr-6', 'is-success', {
                  'is-outlined': activeCategory !== 'all',
                })}
              >
                All
              </a>

              {categoriesFromServer.map(category => (
                <a
                  key={category.id}
                  data-cy="Category"
                  className={classNames('button', 'mr-2', 'my-1', {
                    'is-info': category.title === activeCategory,
                  })}
                  href="#/"
                  onClick={() => setActiveCategory(category.title)}
                >
                  {category.title}
                </a>
              ))}
            </div>

            <div className="panel-block">
              <a
                data-cy="ResetAllButton"
                href="#/"
                className="button is-link is-outlined is-fullwidth"
              >
                Reset all filters
              </a>
            </div>
          </nav>
        </div>

        <div className="box table-container">
          <p data-cy="NoMatchingMessage">
            No products matching selected criteria
          </p>

          <table
            data-cy="ProductTable"
            className="table is-striped is-narrow is-fullwidth"
          >
            <thead>
              <tr>
                <th>
                  <span className="is-flex is-flex-wrap-nowrap">
                    ID
                    <a href="#/">
                      <span className="icon">
                        <i data-cy="SortIcon" className="fas fa-sort" />
                      </span>
                    </a>
                  </span>
                </th>

                <th>
                  <span className="is-flex is-flex-wrap-nowrap">
                    Product
                    <a href="#/">
                      <span className="icon">
                        <i data-cy="SortIcon" className="fas fa-sort-down" />
                      </span>
                    </a>
                  </span>
                </th>

                <th>
                  <span className="is-flex is-flex-wrap-nowrap">
                    Category
                    <a href="#/">
                      <span className="icon">
                        <i data-cy="SortIcon" className="fas fa-sort-up" />
                      </span>
                    </a>
                  </span>
                </th>

                <th>
                  <span className="is-flex is-flex-wrap-nowrap">
                    User
                    <a href="#/">
                      <span className="icon">
                        <i data-cy="SortIcon" className="fas fa-sort" />
                      </span>
                    </a>
                  </span>
                </th>
              </tr>
            </thead>

            <tbody>
              {visibleProducts.map(product => (
                <tr key={product.id} data-cy="Product">
                  <td className="has-text-weight-bold" data-cy="ProductId">
                    {product.id}
                  </td>

                  <td data-cy="ProductName">{product.name}</td>
                  <td data-cy="ProductCategory">
                    {product.findCategory.icon} - {product.findCategory.title}
                  </td>

                  <td
                    data-cy="ProductUser"
                    className={classNames({
                      'has-text-danger': product.findUser.sex === 'f',
                      'has-text-link': product.findUser.sex === 'm',
                    })}
                  >
                    {product.findUser.name}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
