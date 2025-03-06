interface CustomerResponseOK {
    Result: "OK";
    memberId: number;
}

interface CustomerResponseNotFound {
    Result: "NOT_FOUND";
}

export type CustomerResponse = CustomerResponseOK | CustomerResponseNotFound;