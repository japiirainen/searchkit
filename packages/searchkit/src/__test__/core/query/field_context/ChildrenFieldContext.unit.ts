import {
  ChildrenFieldContext,
  FieldContextFactory,
  TermsBucket,
  ChildrenBucket,
  TermQuery,
  HasChildQuery
} from '../../../../'

describe('ChildrenFieldContext', () => {
  beforeEach(() => {
    this.fieldContext = FieldContextFactory({
      type: 'children',
      options: {
        childType: 'tags',
        score_mode: 'sum'
      }
    })
  })

  it('should be instance of ChildrenFieldContext', () => {
    expect(this.fieldContext).toEqual(jasmine.any(ChildrenFieldContext))
  })

  it('should validate missing childType', () => {
    expect(() => FieldContextFactory({ type: 'children' })).toThrowError(
      'fieldOptions type:children requires options.childType'
    )
  })

  it('getAggregationPath()', () => {
    expect(this.fieldContext.getAggregationPath()).toBe('inner')
  })

  it('wrapAggregations()', () => {
    const agg1 = TermsBucket('terms', 'name')
    const agg2 = TermsBucket('terms', 'color')
    expect(this.fieldContext.wrapAggregations(agg1, agg2)).toEqual([
      ChildrenBucket('inner', 'tags', agg1, agg2)
    ])
  })

  it('wrapFilter()', () => {
    const termFilter = TermQuery('color', 'red')
    expect(this.fieldContext.wrapFilter(termFilter)).toEqual(
      HasChildQuery('tags', termFilter, { score_mode: 'sum' })
    )
  })
})
