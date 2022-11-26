export const getCompleteDocumentData = <T>(
  snapshot:
    | FirebaseFirestore.QueryDocumentSnapshot<FirebaseFirestore.DocumentData>
    | FirebaseFirestore.DocumentSnapshot<FirebaseFirestore.DocumentData>
    | undefined
    | null
): T => ({
  ...(snapshot?.data() as T),
  id: snapshot?.id,
  updatedAt: snapshot?.updateTime?.toDate(),
  createdAt: snapshot?.createTime?.toDate(),
});

export const temp = {};
