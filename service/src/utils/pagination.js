exports.paginate = (items, page, limit, totalItems) => {
    const totalPages = Math.ceil(totalItems / limit);
  
    return {
      success: true,
      data: items,
      pagination: {
        currentPage: page,
        limit,
        totalItems,
        totalPages,
        hasNextPage: page < totalPages,
        hasPrevPage: page > 1
      }
    };
  };
  