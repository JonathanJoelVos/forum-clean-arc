import { Either, left, right } from "./either";

function doSomething(success: boolean): Either<string, number> {
  if (success) {
    return right(1);
  }

  return left("error");
}

test("success result", () => {
  const result = doSomething(true);

  expect(result.isRight()).toEqual(true);
  expect(result.isLeft()).toEqual(false);
});

test("error result", () => {
  const result = doSomething(false);

  expect(result.isRight()).toEqual(false);
  expect(result.isLeft()).toEqual(true);
});
