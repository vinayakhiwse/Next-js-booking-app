import React from "react";
import ReactPaginate from "react-paginate";

const CommonPagination = (props) => {
  const { pageCount, handlePageClick } = props;
  return (
    <div className="text-right pagination-services">
      <div className="pagination-ctm d-flex">
        <ReactPaginate
          previousLabel={<i className="fas fa-arrow-left" />}
          nextLabel={<i className="fas fa-arrow-right" />}
          onPageChange={handlePageClick}
          pageRangeDisplayed={3}
          marginPagesDisplayed={2}
          pageCount={pageCount}
          disabledClassName="d-none"
          pageLinkClassName="link"
          pageClassName="item"
          previousLinkClassName="page-arow-l"
          nextLinkClassName="page-arow-l"
          containerClassName="my-pagination d-flex"
          activeLinkClassName="active"
        />
      </div>
    </div>
  );
};

export default CommonPagination;
