# coding: utf-8
def max_sum(alist):
    if not alist:
        raise ValueError('Please pass the iterator')
    # let us assume that first element in the list is the largest sum
    s = alist[0]
    start = 1
    while start < len(alist):
        if alist[start] + s > s:
            s = alist[start] + s
        start +=1
    return s
